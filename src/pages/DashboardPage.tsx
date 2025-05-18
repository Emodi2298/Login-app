import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { 
  User, 
  Settings, 
  FileText, 
  Users, 
  Shield, 
  LogOut,
  Edit,
  Eye
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case UserRole.EDITOR:
        return 'bg-blue-100 text-blue-800';
      case UserRole.VIEWER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Shield className="h-4 w-4" />;
      case UserRole.EDITOR:
        return <Edit className="h-4 w-4" />;
      case UserRole.VIEWER:
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">TDD Auth App</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role as UserRole)}`}>
                  {getRoleIcon(user?.role as UserRole)}
                  <span className="ml-1">{user?.role}</span>
                </span>
                <span className="ml-3 text-sm font-medium text-gray-700">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
                <h2 className="text-lg font-medium text-gray-900">Bienvenido, {user?.username}</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Tu nivel de acceso es: <strong>{user?.role}</strong>
                </p>
                
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Card for all users */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Documentos Públicos
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                Acceso Permitido
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Ver documentos
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card for editors and admins */}
                  <div className={`bg-white overflow-hidden shadow rounded-lg ${!hasPermission(UserRole.EDITOR) ? 'opacity-50' : ''}`}>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                          <Edit className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Editar Contenido
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {hasPermission(UserRole.EDITOR) ? 'Acceso Permitido' : 'Acceso Denegado'}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="text-sm">
                        {hasPermission(UserRole.EDITOR) ? (
                          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Editar contenido
                          </a>
                        ) : (
                          <span className="font-medium text-gray-400">
                            Requiere rol de Editor
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Card for admins only */}
                  <div className={`bg-white overflow-hidden shadow rounded-lg ${!hasPermission(UserRole.ADMIN) ? 'opacity-50' : ''}`}>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                          <Settings className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Configuración del Sistema
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {hasPermission(UserRole.ADMIN) ? 'Acceso Permitido' : 'Acceso Denegado'}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="text-sm">
                        {hasPermission(UserRole.ADMIN) ? (
                          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Administrar sistema
                          </a>
                        ) : (
                          <span className="font-medium text-gray-400">
                            Requiere rol de Administrador
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;