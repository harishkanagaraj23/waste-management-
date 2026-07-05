import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to home or corresponding role dashboard
    const defaultDash = user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/citizen';
    return <Navigate to={defaultDash} replace />;
  }

  return children;
}
