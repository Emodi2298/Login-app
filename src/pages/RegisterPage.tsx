import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { UserPlus } from 'lucide-react';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <UserPlus className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          Crear Nueva Cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Regístrate para acceder a la aplicación
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;