import { ValidationError, PasswordValidationResult } from '../types/auth';

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: ValidationError[] = [];
  
  if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'La contraseña debe tener al menos 8 caracteres.'
    });
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'La contraseña debe incluir al menos una letra mayúscula.'
    });
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'La contraseña debe incluir al menos una letra minúscula.'
    });
  }
  
  if (!/\d/.test(password)) {
    errors.push({
      field: 'password',
      message: 'La contraseña debe contener al menos un número.'
    });
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'La contraseña debe tener al menos un carácter especial.'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};