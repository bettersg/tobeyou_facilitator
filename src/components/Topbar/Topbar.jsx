import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from '../Sidebar/Sidebar';
import { StyledTopbar, NavbarText } from './StyledTopbar';
import { FlexBoxCenter } from '../styled/general';
import { Box } from '@mui/material';

export const Topbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  return (
    <StyledTopbar>
      <Box sx={{ cursor: 'pointer', marginLeft: '20px' }}>
        <img src='/general/logo.png' width='60' onClick={() => navigate('/')} />
      </Box>
      <FlexBoxCenter>
        <NavbarText href={'https://game.tobeyou.sg/'} variant='body2'>
          Play Game
        </NavbarText>
        <NavbarText variant='body2'>Lesson Plan</NavbarText>
        <NavbarText onClick={logout}>{currentUser.displayName}</NavbarText>
        <Sidebar />
      </FlexBoxCenter>
    </StyledTopbar>
  );
};
