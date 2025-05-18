import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

// Mock del hook useAuth
vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

describe('Ruta Protegida (ProtectedRoute)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });


  it('redirigir al login si el usuario no está autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasPermission: vi.fn()
    });

    render(
      <MemoryRouter initialEntries={['/protegido']}>
        <Routes>
          <Route path="/login" element={<div>Página de Inicio de Sesión</div>} />
          <Route path="/protegido" element={
            <ProtectedRoute>
              <div>Contenido Protegido</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Contenido Protegido')).not.toBeInTheDocument();
    expect(screen.getByText('Página de Inicio de Sesión')).toBeInTheDocument();
  });

  it('redirigir a acceso denegado si el usuario no tiene permisos', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', username: 'usuario', role: UserRole.VIEWER },
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasPermission: () => false
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/access-denied" element={<div>Acceso Denegado</div>} />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole={UserRole.ADMIN}>
              <div>Contenido de Administrador</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Contenido de Administrador')).not.toBeInTheDocument();
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
  });

  it('renderizar el contenido cuando el usuario tiene permisos', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', username: 'admin', role: UserRole.ADMIN },
      isLoading: false,
      error: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      hasPermission: () => true
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute requiredRole={UserRole.ADMIN}>
              <div>Contenido de Administrador</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido de Administrador')).toBeInTheDocument();
  });
});
 