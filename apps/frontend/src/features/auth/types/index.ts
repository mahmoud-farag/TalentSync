export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  accountType: string;
}

export interface FormFieldError {
  field: string;
  message: string;
}