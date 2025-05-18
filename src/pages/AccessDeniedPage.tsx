import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-red-100 p-4">
          <ShieldAlert className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-gray-900">Acceso Denegado</h1>
        <p className="mt-3 text-lg text-gray-600">
          No tienes permisos suficientes para acceder a esta página.
        </p>
        <div className="mt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;