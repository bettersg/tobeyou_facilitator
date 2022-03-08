import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router';
import Topbar from '../topbar/Topbar';

const DashboardLayout = () => {
  return (
    <Box>
      <Topbar />
      <Box
        style={{
          marginTop: 50,
          marginLeft: 50,
          marginRight: 50,
          marginBottom: 20,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
