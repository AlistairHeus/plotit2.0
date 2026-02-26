export const PG_ERROR_CODES = {
  FOREIGN_KEY_VIOLATION: '23503',
  UNIQUE_VIOLATION: '23505',
  CHECK_VIOLATION: '23514',
  NOT_NULL_VIOLATION: '23502',
};

export const VALID_GENDER_VALUES = [
  'male',
  'female',
  'other',
  'prefer-not-to-say',
] as const;

export const codeRegex = /^[A-Z0-9_]+$/;
