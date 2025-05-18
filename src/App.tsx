import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import { UserRole } from './types/auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole={UserRole.ADMIN}>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Admin Area</h1>
                  <p>This area is only accessible to administrators.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Editor routes */}
          <Route 
            path="/editor/*" 
            element={
              <ProtectedRoute requiredRole={UserRole.EDITOR}>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Editor Area</h1>
                  <p>This area is accessible to editors and administrators.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;