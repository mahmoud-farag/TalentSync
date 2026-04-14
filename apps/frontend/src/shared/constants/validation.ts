/**
 * Validation patterns and rules
 */
export const VALIDATION = {
  // Email pattern
  EMAIL_PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },

  // Name requirements
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },

  // Phone pattern
  PHONE_PATTERN: /^\+?[\d\s-]{10,}$/,

  // URL pattern
  URL_PATTERN: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
} as const;

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}
/**
 * Password validation rules
 */
export const getPasswordValidationRules = (): ValidationRule [] => [
  {
    test: (password: string) => password.length >= VALIDATION.PASSWORD.MIN_LENGTH,
    message: `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`,
  },
  {
    test: (password: string) => /[A-Z]/.test(password),
    message: 'Password must contain at least one uppercase letter',
  },
  {
    test: (password: string) => /[a-z]/.test(password),
    message: 'Password must contain at least one lowercase letter',
  },
  {
    test: (password: string) => /\d/.test(password),
    message: 'Password must contain at least one number',
  },
  {
    test: (password: string) => /[@$!%*?&]/.test(password),
    message: 'Password must contain at least one special character (@$!%*?&)',
  },
];

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_PATTERN.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return VALIDATION.PASSWORD.PATTERN.test(password);
};
