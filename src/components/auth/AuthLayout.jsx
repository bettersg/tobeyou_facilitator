import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const AuthLayout = () => {
  const { currentUser, isLoggingInTeacher } = useAuth();
  if (currentUser && !isLoggingInTeacher) {
    return <Navigate to='/' />;
  }

  return (
    <div>
      <Outlet/>
    </div>
  );
};

export default AuthLayout;
