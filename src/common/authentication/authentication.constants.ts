// Lazy-loaded constants to ensure environment variables are loaded first
export const AUTH_CONSTANTS = {
  get JWT_SECRET() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return secret;
  },
  get JWT_REFRESH_SECRET() {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET environment variable is required');
    }
    return secret;
  },
  get JWT_EXPIRES_IN() {
    const expiresIn = process.env.JWT_EXPIRES_IN;

    if (!expiresIn) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return expiresIn;
  },
  get JWT_REFRESH_EXPIRES_IN() {
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    if (!refreshExpiresIn) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return refreshExpiresIn;
  },
  get BCRYPT_SALT_ROUNDS() {
    return Number(process.env.BCRYPT_SALT_ROUNDS);
  },
  get MAX_REFRESH_TOKENS_PER_USER() {
    return Number(process.env.MAX_REFRESH_TOKENS_PER_USER);
  },
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_INACTIVE: 'User account is inactive',
  TOKEN_REQUIRED: 'Authentication token required',
  TOKEN_INVALID: 'Invalid or expired token',
  REFRESH_TOKEN_REQUIRED: 'Refresh token required',
  REFRESH_TOKEN_INVALID: 'Invalid or expired refresh token',
  REFRESH_TOKEN_REVOKED: 'Refresh token has been revoked',
  ACCESS_DENIED: 'Access denied',
  LOGIN_FAILED: 'Login failed',
} as const;
