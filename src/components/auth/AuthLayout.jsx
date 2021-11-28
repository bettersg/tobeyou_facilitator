import React from 'react';
import { Box } from '@material-ui/core';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const AuthLayout = () => {
  const { currentUser, isLoggingInFacilitator } = useAuth();
  if (currentUser && !isLoggingInFacilitator) {
    return <Navigate to='/' />;
  }

  return (
    <Box style={{ marginLeft: 200, marginRight: 200 }}>
      <Outlet/>
    </Box>
  );
};

export default AuthLayout;
