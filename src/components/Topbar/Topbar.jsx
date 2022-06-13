import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from '../Sidebar/Sidebar';
import { StyledTopbar, NavbarText } from './StyledTopbar';
import { FlexBoxCenter } from '../styled/general';
import { Box, Link, Menu, MenuItem } from '@mui/material';

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
        <NavbarText href={'https://youtu.be/ueY980OH_j4'} variant='body2'>
          Platform Help
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
          Facilitation Resources
        </NavbarText>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={handleClose}
            href={
              'https://docs.google.com/presentation/d/1XsiCXh4mgDa4O470tRjYaThRSJ4lAQ7HjrPzrMhvRZc/edit?usp=sharing'
            }
            component={Link}
          >
            Classroom Lesson Plan
          </MenuItem>
          <MenuItem
            onClick={handleClose}
            href={
              'https://docs.google.com/presentation/d/1XsiCXh4mgDa4O470tRjYaThRSJ4lAQ7HjrPzrMhvRZc/edit?usp=sharing'
            }
            component={Link}
          >
            Youth Engagement (Pending)
          </MenuItem>
          <MenuItem
            onClick={handleClose}
            href={
              'https://docs.google.com/presentation/d/1XsiCXh4mgDa4O470tRjYaThRSJ4lAQ7HjrPzrMhvRZc/edit?usp=sharing'
            }
            component={Link}
          >
            Corporate Training (Pending)
          </MenuItem>
        </Menu>
        <NavbarText onClick={logout}>{currentUser.displayName}</NavbarText>
        <Sidebar />
      </FlexBoxCenter>
    </StyledTopbar>
  );
};
