import { styled } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

export const StyledTopbar = styled(Box)(({ theme }) => ({
  background: theme.palette.midnight[100],
  height: 50,
  width: '100%',
  position: 'fixed',
  top: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 1000,
}));

export const NavbarText = styled(Link)(({ theme }) => ({
  color: 'white',
  marginRight: 12,
  cursor: 'pointer',
  fontWeight: 600,
}));
