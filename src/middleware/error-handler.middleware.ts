import type { NextFunction, Request, Response } from 'express';
import { PG_ERROR_CODES } from '@/common/common.constants';
import {
  AppError,
  ERROR_CATEGORY,
  type ErrorCategory,
  type ErrorResponse,
  ForeignKeyConstraintError,
  HTTP_STATUS_CODE,
  type HttpStatusCode,
  ValidationError,
} from '@/common/error.types';
import { log } from '@/utils/logger';

// Define PostgresError interface to properly type Postgres errors
interface PostgresError extends Error {
  code: string;
  detail?: string;
  schema_name?: string;
  table_name?: string;
  column_name?: string;
  constraint_name?: string;
  severity?: string;
  severity_local?: string;
  file?: string;
  line?: string;
  routine?: string;
}

// Regex for extracting key and value from foreign key error messages
const FK_ERROR_REGEX = /Key \(([^)]+)\)=\(([^)]+)\)/;

/**
 * Global error handler middleware
 * Processes all errors and returns standardized error responses
 */
export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Generate request ID for tracking
  const requestId =
    (req.headers['x-request-id'] as string) || generateRequestId();

  // Process the error and get error details
  const errorDetails = processError(error);

  // Log error with context
  const logContext = {
    requestId,
    method: req.method,
    path: req.path,
    statusCode: errorDetails.statusCode,
    category: errorDetails.category,
    code: errorDetails.code,
    userId: (req as Request).user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    ...(errorDetails.details && { details: errorDetails.details }),
  };

  if (errorDetails.statusCode >= 500) {
    log.error('Server error occurred', logContext);
  } else if (errorDetails.statusCode >= 400) {
    log.warn('Client error occurred', logContext);
  }

  // Build standardized error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: errorDetails.code,
      message: errorDetails.message,
      category: errorDetails.category,
      timestamp: new Date().toISOString(),
      requestId,
      ...(errorDetails.details && { details: errorDetails.details }),
      ...(errorDetails.validationErrors && {
        validationErrors: errorDetails.validationErrors,
      }),
    },
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && error.stack) {
    errorResponse.error.stack = error.stack;
  }

  res.status(errorDetails.statusCode).json(errorResponse);
};

/**
 * Process different types of errors and return standardized error details
 */
function processError(error: Error): {
  statusCode: HttpStatusCode;
  category: ErrorCategory;
  code: string;
  message: string;
  details: Record<string, unknown> | undefined;
  validationErrors: ValidationError['validationErrors'] | undefined;
} {
  // Default error values
  let statusCode: HttpStatusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  let category: ErrorCategory = ERROR_CATEGORY.INTERNAL;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details: Record<string, unknown> | undefined;
  let validationErrors: ValidationError['validationErrors'] | undefined;

  // Process different error types
  if (error instanceof AppError) {
    // Handle custom application errors
    statusCode = error.statusCode;
    category = error.category;
    code = error.code || 'APP_ERROR';
    message = error.message;
    details = error.details;

    if (error instanceof ValidationError) {
      validationErrors = error.validationErrors;
    }
  } else if (error.name === 'ZodError') {
    // Handle Zod validation errors that weren't caught by middleware
    const zodError = error as unknown as {
      errors: Array<{
        path: string[];
        message: string;
        code: string;
        received: unknown;
      }>;
    };
    statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    category = ERROR_CATEGORY.VALIDATION;
    code = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    validationErrors = zodError.errors?.map((err) => ({
      field: err.path?.join('.') || 'unknown',
      message: err.message,
      code: err.code,
      value: err.received,
    }));
  } else if (isPostgresError(error)) {
    // Handle Postgres-specific errors using error codes
    const errorInfo = {
      statusCode,
      category,
      code,
      message,
      details,
    };
    handlePostgresError(error as PostgresError, errorInfo);
    statusCode = errorInfo.statusCode;
    category = errorInfo.category;
    code = errorInfo.code;
    message = errorInfo.message;
    details = errorInfo.details;
  } else if (
    error.message?.includes('duplicate key') ||
    error.message?.includes('unique constraint')
  ) {
    // Fallback for other unique constraint errors
    statusCode = HTTP_STATUS_CODE.CONFLICT;
    category = ERROR_CATEGORY.CONFLICT;
    code = 'RESOURCE_CONFLICT';
    message = 'Resource already exists or conflicts with existing data';
    details = { originalError: error.message };
  } else if (error.message?.includes('foreign key constraint')) {
    // Fallback for other foreign key constraint errors
    statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    category = ERROR_CATEGORY.VALIDATION;
    code = 'INVALID_REFERENCE';
    message = 'Referenced resource does not exist';
    details = { originalError: error.message };
  } else if (
    error.message?.includes('not found') ||
    error.message?.includes('does not exist')
  ) {
    // Handle generic not found errors
    statusCode = HTTP_STATUS_CODE.NOT_FOUND;
    category = ERROR_CATEGORY.NOT_FOUND;
    code = 'RESOURCE_NOT_FOUND';
    message = 'Requested resource not found';
  } else {
    // Handle unexpected errors
    statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
    category = ERROR_CATEGORY.INTERNAL;
    code = 'INTERNAL_ERROR';
    message = 'An unexpected error occurred';
    details =
      process.env.NODE_ENV === 'development'
        ? { originalError: error.message }
        : undefined;
  }

  return {
    statusCode,
    category,
    code,
    message,
    details,
    validationErrors,
  };
}

/**
 * Handle Postgres-specific errors
 */
function handlePostgresError(
  pgError: PostgresError,
  errorInfo: {
    statusCode: HttpStatusCode;
    category: ErrorCategory;
    code: string;
    message: string;
    details: Record<string, unknown> | undefined;
  }
): void {
  const errorCode = pgError.code;
  const constraintDetails = extractConstraintDetails(pgError);

  switch (errorCode) {
    case PG_ERROR_CODES.UNIQUE_VIOLATION:
      // Handle unique constraint violations
      errorInfo.statusCode = HTTP_STATUS_CODE.CONFLICT;
      errorInfo.category = ERROR_CATEGORY.CONFLICT;
      errorInfo.code = 'RESOURCE_CONFLICT';
      errorInfo.message =
        'Resource already exists or conflicts with existing data';
      errorInfo.details = constraintDetails;
      break;

    case PG_ERROR_CODES.FOREIGN_KEY_VIOLATION: {
      // Handle foreign key constraint violations
      errorInfo.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
      errorInfo.category = ERROR_CATEGORY.VALIDATION;
      errorInfo.code = 'INVALID_REFERENCE';

      // Extract table and constraint information for better error messages
      const referencedTable =
        constraintDetails.table_name?.toString() || 'unknown';
      const constraintName =
        constraintDetails.constraint_name?.toString() || 'unknown';

      // Create a more specific error message
      const detailStr = constraintDetails.detail?.toString() || '';
      if (detailStr.includes('is not present')) {
        // Extract the key and value from the error detail
        const keyMatch = detailStr.match(FK_ERROR_REGEX);
        if (keyMatch && keyMatch.length >= 3) {
          const [, key, value] = keyMatch;
          // Use the new ForeignKeyConstraintError for consistent error messages
          const fkError = new ForeignKeyConstraintError(
            referencedTable,
            key || 'unknown',
            value || 'unknown',
            constraintDetails
          );
          errorInfo.message = fkError.message;
          errorInfo.details = fkError.details;
        } else {
          errorInfo.message = `Referenced resource does not exist in ${referencedTable}`;
          errorInfo.details = constraintDetails;
        }
      } else {
        errorInfo.message = `Foreign key constraint violation on ${constraintName}`;
        errorInfo.details = constraintDetails;
      }
      break;
    }

    case PG_ERROR_CODES.NOT_NULL_VIOLATION:
      // Handle not null violations
      errorInfo.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
      errorInfo.category = ERROR_CATEGORY.VALIDATION;
      errorInfo.code = 'MISSING_REQUIRED_FIELD';
      errorInfo.message = 'Required field is missing';
      errorInfo.details = constraintDetails;
      break;

    case PG_ERROR_CODES.CHECK_VIOLATION:
      // Handle check constraint violations
      errorInfo.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
      errorInfo.category = ERROR_CATEGORY.VALIDATION;
      errorInfo.code = 'INVALID_VALUE';
      errorInfo.message = 'Value does not meet validation requirements';
      errorInfo.details = constraintDetails;
      break;

    default:
      // Handle other database errors
      errorInfo.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
      errorInfo.category = ERROR_CATEGORY.DATABASE;
      errorInfo.code = 'DATABASE_ERROR';
      errorInfo.message = 'A database error occurred';
      errorInfo.details = {
        originalError: pgError.message,
        code: pgError.code,
      };
  }
}

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const requestId =
    (req.headers['x-request-id'] as string) || generateRequestId();

  log.warn('Route not found', {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      category: ERROR_CATEGORY.NOT_FOUND,
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  res.status(HTTP_STATUS_CODE.NOT_FOUND).json(errorResponse);
};

/**
 * Generate a simple request ID for tracking
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an error is a Postgres error
 */
function isPostgresError(error: unknown): error is PostgresError {
  const pgError = error as Partial<PostgresError>;
  return (
    !!pgError &&
    (pgError.name === 'PostgresError' ||
      (typeof pgError.code === 'string' &&
        (Object.values(PG_ERROR_CODES).includes(pgError.code) ||
          pgError.code.startsWith('23'))))
  );
}

/**
 * Extract constraint details from a Postgres error
 */
function extractConstraintDetails(
  error: PostgresError
): Record<string, unknown> {
  const details: Record<string, unknown> = {};

  // Extract common Postgres error fields
  const fieldsToExtract: Array<keyof PostgresError> = [
    'detail',
    'schema_name',
    'table_name',
    'column_name',
    'constraint_name',
    'code',
  ];

  for (const field of fieldsToExtract) {
    if (error[field]) {
      details[field] = error[field];
    }
  }

  return details;
}
