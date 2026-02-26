import type { ZodError } from 'zod/v4';

// Error categories for better error handling
export const ERROR_CATEGORY = {
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  CONFLICT: 'CONFLICT',
  DATABASE: 'DATABASE',
  EXTERNAL_SERVICE: 'EXTERNAL_SERVICE',
  INTERNAL: 'INTERNAL',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  VALIDATION: 'VALIDATION',
} as const;

export type ErrorCategory =
  (typeof ERROR_CATEGORY)[keyof typeof ERROR_CATEGORY];

// HTTP Status codes
export const HTTP_STATUS_CODE = {
  BAD_GATEWAY: 502,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  CREATED: 201,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
  OK: 200,
  SERVICE_UNAVAILABLE: 503,
  TOO_MANY_REQUESTS: 429,
  UNAUTHORIZED: 401,
  UNPROCESSABLE_ENTITY: 422,
} as const;

export type HttpStatusCode =
  (typeof HTTP_STATUS_CODE)[keyof typeof HTTP_STATUS_CODE];

// Base application error interface
export interface AppErrorData {
  category: ErrorCategory;
  cause?: Error | undefined;
  code?: string | undefined;
  details?: Record<string, unknown> | undefined;
  isOperational?: boolean | undefined;
  message: string;
  statusCode: HttpStatusCode;
}

// Enhanced error response for API
export interface ErrorResponse {
  error: {
    category: ErrorCategory;
    code?: string;
    details?: Record<string, unknown>;
    message: string;
    requestId?: string;
    stack?: string; // Only in development
    timestamp: string;
    validationErrors?: ValidationErrorDetail[];
  };
  success: false;
}

// Validation error details
export interface ValidationErrorDetail {
  code: string;
  field: string;
  message: string;
  value?: unknown;
}

// Application Error class
export class AppError extends Error {
  readonly category: ErrorCategory;
  readonly cause?: Error;
  readonly code?: string;
  readonly details?: Record<string, unknown>;
  readonly isOperational: boolean;
  readonly statusCode: HttpStatusCode;
  readonly timestamp: Date;

  constructor(data: AppErrorData) {
    super(data.message);

    this.name = 'AppError';
    this.statusCode = data.statusCode;
    this.category = data.category;
    if (data.code !== undefined) {
      this.code = data.code;
    }
    if (data.details !== undefined) {
      this.details = data.details;
    }
    this.isOperational = data.isOperational ?? true;
    this.timestamp = new Date();

    if (data.cause) {
      this.cause = data.cause;
    }

    Error.captureStackTrace(this);
  }

  toJSON() {
    return {
      category: this.category,
      code: this.code,
      details: this.details,
      isOperational: this.isOperational,
      message: this.message,
      name: this.name,
      stack: this.stack,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({
      category: ERROR_CATEGORY.VALIDATION,
      code: 'BAD_REQUEST',
      details,
      message,
      statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({
      category: ERROR_CATEGORY.CONFLICT,
      code: 'RESOURCE_CONFLICT',
      details,
      message,
      statusCode: HTTP_STATUS_CODE.CONFLICT,
    });
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    cause?: Error,
    details?: Record<string, unknown>
  ) {
    super({
      category: ERROR_CATEGORY.DATABASE,
      cause,
      code: 'DATABASE_ERROR',
      details,
      message,
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, cause?: Error) {
    super({
      category: ERROR_CATEGORY.EXTERNAL_SERVICE,
      cause,
      code: 'EXTERNAL_SERVICE_ERROR',
      details: { service },
      message: `External service error (${service}): ${message}`,
      statusCode: HTTP_STATUS_CODE.BAD_GATEWAY,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super({
      category: ERROR_CATEGORY.AUTHORIZATION,
      code: 'FORBIDDEN',
      message,
      statusCode: HTTP_STATUS_CODE.FORBIDDEN,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super({
      category: ERROR_CATEGORY.NOT_FOUND,
      code: 'RESOURCE_NOT_FOUND',
      details: { identifier, resource },
      message,
      statusCode: HTTP_STATUS_CODE.NOT_FOUND,
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super({
      category: ERROR_CATEGORY.AUTHENTICATION,
      code: 'UNAUTHORIZED',
      message,
      statusCode: HTTP_STATUS_CODE.UNAUTHORIZED,
    });
  }
}

// Specific error classes
export class ValidationError extends AppError {
  readonly validationErrors: ValidationErrorDetail[];

  constructor(
    message: string,
    validationErrors: ValidationErrorDetail[],
    details?: Record<string, unknown>
  ) {
    super({
      category: ERROR_CATEGORY.VALIDATION,
      code: 'VALIDATION_ERROR',
      details,
      message,
      statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
    });

    this.validationErrors = validationErrors;
  }

  static fromZodError(zodError: ZodError): ValidationError {
    const validationErrors = ValidationError.processZodIssues(zodError.issues);

    // If no specific errors were found, create a generic one
    if (validationErrors.length === 0) {
      validationErrors.push({
        code: 'validation_error',
        field: 'unknown',
        message: 'Validation failed. Please check your input.',
      });
    }

    return new ValidationError('Validation failed', validationErrors, {
      zodError: zodError.issues,
    });
  }

  private static processZodIssues(
    issues: ZodError['issues']
  ): ValidationErrorDetail[] {
    const validationErrors: ValidationErrorDetail[] = [];
    const processedFields = new Set<string>();

    for (const issue of issues) {
      const field = issue.path.join('.');

      // Skip if we've already processed this field (to avoid duplicates)
      if (processedFields.has(field)) {
        continue;
      }

      processedFields.add(field);

      // Get all issues for this field
      const fieldIssues = issues.filter((i) => i.path.join('.') === field);

      const validationError = ValidationError.createValidationErrorFromIssues(
        field,
        fieldIssues
      );
      if (validationError) {
        validationErrors.push(validationError);
      }
    }

    return validationErrors;
  }

  private static createValidationErrorFromIssues(
    field: string,
    fieldIssues: ZodError['issues']
  ): ValidationErrorDetail | null {
    // For union errors, provide a cleaner message
    if (
      fieldIssues.length > 1 &&
      fieldIssues.some((i) => i.code === 'invalid_union')
    ) {
      return {
        code: 'invalid_value',
        field: field || '_root',
        message: ValidationError.humanizeErrorMessage(
          field,
          `Invalid value for ${field || 'input'}. Please check the required format.`
        ),
      };
    }

    // Use the first issue for this field
    const firstIssue = fieldIssues[0];
    if (!firstIssue) {
      return null;
    }

    return {
      code: ValidationError.getErrorCode(firstIssue.code),
      field: field || '_root',
      message: ValidationError.humanizeErrorMessage(field, firstIssue.message),
      value: 'received' in firstIssue ? firstIssue.received : undefined,
    };
  }

  private static getErrorCode(zodCode: string): string {
    switch (zodCode) {
      case 'invalid_type':
        return 'invalid_type';
      case 'invalid_literal':
        return 'invalid_value';
      case 'unrecognized_keys':
        return 'unrecognized_keys';
      case 'invalid_union':
        return 'invalid_value';
      case 'invalid_union_discriminator':
        return 'invalid_value';
      case 'invalid_enum_value':
        return 'invalid_enum';
      case 'invalid_arguments':
        return 'invalid_arguments';
      case 'invalid_return_type':
        return 'invalid_return_type';
      case 'invalid_date':
        return 'invalid_date';
      case 'invalid_string':
        return 'invalid_format';
      case 'too_small':
        return 'too_small';
      case 'too_big':
        return 'too_big';
      case 'invalid_intersection_types':
        return 'invalid_intersection';
      case 'not_multiple_of':
        return 'not_multiple_of';
      case 'not_finite':
        return 'not_finite';
      case 'custom':
        return 'custom_error';
      default:
        return 'validation_error';
    }
  }

  private static humanizeErrorMessage(field: string, message: string): string {
    // Convert field names to human-readable format
    const humanField = field
      ? field
          .split('.')
          .map((part) =>
            part
              .replace(/([A-Z])/g, ' $1')
              .toLowerCase()
              .trim()
          )
          .join(' → ')
      : 'input';

    // Improve common error messages
    if (message.includes('Required')) {
      return `${humanField} is required`;
    }

    if (message.includes('expected string, received undefined')) {
      return `${humanField} is required`;
    }

    if (message.includes('expected string, received number')) {
      return `${humanField} must be a text value`;
    }

    if (message.includes('expected number, received string')) {
      return `${humanField} must be a number`;
    }

    if (message.includes('expected number, received undefined')) {
      return `${humanField} is required and must be a number`;
    }

    if (message.includes('Invalid email')) {
      return `${humanField} must be a valid email address`;
    }

    if (message.includes('Invalid input')) {
      return `${humanField} has an invalid value`;
    }

    if (message.includes('String must contain at least')) {
      return `${humanField} is too short`;
    }

    if (message.includes('String must contain at most')) {
      return `${humanField} is too long`;
    }

    if (message.includes('Number must be greater than')) {
      return `${humanField} must be greater than the minimum value`;
    }

    if (message.includes('Number must be less than')) {
      return `${humanField} must be less than the maximum value`;
    }

    // Return the original message if no specific improvement is found
    return message;
  }
}

// Foreign key constraint violation error
export class ForeignKeyConstraintError extends AppError {
  constructor(
    referencedTable: string,
    keyName: string,
    keyValue: string,
    details?: Record<string, unknown>
  ) {
    super({
      category: ERROR_CATEGORY.VALIDATION,
      code: 'INVALID_REFERENCE',
      details: {
        ...details,
        referencedTable,
        keyName,
        keyValue,
      },
      message: `Referenced ${keyName} '${keyValue}' does not exist in ${referencedTable}`,
      statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
    });
  }
}
