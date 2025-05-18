import { describe, it, expect } from 'vitest';
import { validatePassword } from '../passwordValidator';

describe('Validador de Contraseña', () => {
  it('validar una contraseña fuerte', () => {
    const resultado = validatePassword('StrongP@ss1');
    expect(resultado.isValid).toBe(true);
    expect(resultado.errors).toHaveLength(0);
  });
  
  it('rechazar contraseñas con menos de 8 caracteres', () => {
    const resultado = validatePassword('Sh@rt');
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContainEqual({
      field: 'password',
      message: 'La contraseña debe tener al menos 8 caracteres.'
    }); 
  });
  
  it('rechazar contraseñas sin letras mayúsculas', () => {
    const resultado = validatePassword('nouppercases1@');
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContainEqual({
      field: 'password',
      message: 'La contraseña debe incluir al menos una letra mayúscula.'
    });
  });
  
  it('rechazar contraseñas sin letras minúsculas', () => {
    const resultado = validatePassword('NOLOWERCASE1@');
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContainEqual({
      field: 'password',
      message: 'La contraseña debe incluir al menos una letra minúscula.'
    });
  });
  
  it('rechazar contraseñas sin números', () => {
    const resultado = validatePassword('NoNumbers@');
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContainEqual({
      field: 'password',
      message: 'La contraseña debe contener al menos un número.'
    });
  });
  
  it('debería rechazar contraseñas sin caracteres especiales', () => {
    const resultado = validatePassword('NoSpecial123');
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContainEqual({
      field: 'password',
      message: 'La contraseña debe tener al menos un carácter especial.'
    });
  });
  
});
