import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const authed = typeof window !== 'undefined' && localStorage.getItem('auth') === 'true';
  if (!authed) return <Navigate to="/" replace />;
  return children;
}


