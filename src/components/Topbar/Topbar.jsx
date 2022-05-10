import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from '../Sidebar/Sidebar';
import { StyledTopbar, NavbarText } from './StyledTopbar';
import { FlexBoxCenter } from '../styled/general';
import { Box, Menu, MenuItem } from '@mui/material';

export const Topbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledTopbar>
      <Box sx={{ cursor: 'pointer', marginLeft: '20px' }}>
        <img src='/general/logo.png' width='60' onClick={() => navigate('/')} />
      </Box>
      <FlexBoxCenter>
        <NavbarText href={'https://game.tobeyou.sg/'} variant='body2'>
          Play Game
        </NavbarText>
        <NavbarText
          variant='body2'
          component='button'
          id='basic-menu'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Lesson Plan
        </NavbarText>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Classroom</MenuItem>
          <MenuItem onClick={handleClose}>Corporate</MenuItem>
          <MenuItem onClick={handleClose}>Youth Engagement</MenuItem>
        </Menu>
        <NavbarText onClick={logout}>{currentUser.displayName}</NavbarText>
        <Sidebar />
      </FlexBoxCenter>
    </StyledTopbar>
  );
};
