export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'administrator',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}