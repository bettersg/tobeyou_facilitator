import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const AuthLayout = () => {
  // TODO: change this to redirect if logged in (similar to RequireAuth)
  const { currentUser, isLoggingInFacilitator } = useAuth();
  if (currentUser && !isLoggingInFacilitator) {
    return <Navigate to='/' />;
  }

  return <Outlet/>;
};

export default AuthLayout;
