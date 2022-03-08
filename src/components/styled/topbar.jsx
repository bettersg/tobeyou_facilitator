import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const Navbar = styled(Box)(({ theme }) => ({
  background: '#3DCAD3',
  height: 50,
  width: '100%',
  position: 'fixed',
  top: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const ProfileText = styled(Typography)(({ theme }) => ({
  color: 'white',
  marginRight: 12,
  cursor: 'pointer',
  fontWeight: 700,
}));
