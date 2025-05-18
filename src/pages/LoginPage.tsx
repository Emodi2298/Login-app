import React from 'react';
import LoginForm from '../components/LoginForm';
import { Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <Lock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          Sistema de Autenticación
        </h2>
        <p className="mt-2 text-center text-sm text-gray-700">
          Aplicación de ejemplo con TDD y control de acceso basado en roles
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;