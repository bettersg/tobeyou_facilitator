import React from 'react';
import { useNavigate } from 'react-router';
import {
  Box
} from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';

const Topbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  return (
    <Box style={{ height: 50, width: '100%', position: 'fixed', top: 0, backgroundColor: 'white' }}>
      <Box style={{ height: '100%', padding: '0px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box style={{ display: 'flex', alignItems: 'stretch' }}>
          <Sidebar/>
        </Box>
        <Box>
          <span
            style={{ fontSize: 25, color: 'darkblue', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            ToBeYou
          </span>
        </Box>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ cursor: 'pointer' }} onClick={logout}>{ currentUser.email }</p>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
