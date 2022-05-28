import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router';
import { Topbar } from '../components/Topbar/Topbar';

const DashboardLayout = () => {
  return (
    <Box>
      <Topbar />
      <Box sx={{ paddingTop: '50px', height: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
