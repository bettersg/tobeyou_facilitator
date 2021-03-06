import { alpha, styled } from '@mui/material/styles';
import { Box, Button, Typography, InputBase } from '@mui/material';

export const LoginTextfield = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  width: 250,
  height: 32,
  margin: '4px 0 16px 0',
  input: {
    borderRadius: 8,
    backgroundColor: '#E7E4F9',
    fontSize: 15,

    padding: '8px 8px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const LoginButton = styled(Button)(({ theme }) => ({
  borderRadius: '100px',
  width: 250,
}));

export const LoginFormSection = styled(Box)(({ isNadia, theme }) => ({
  maxHeight: '70%',
  background: 'rgba(255,255,255,0.9)',
  padding: '40px 50px 20px 50px',
  width: '380px',
  borderRadius: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'auto',
  zIndex: '1',

  '&::-webkit-scrollbar': {
    display: 'none',
  },
  ...(isNadia && {
    marginTop: '-30px',
  }),
}));

export const LoginBackground = styled(Box)(({ theme }) => ({
  backgroundImage: `url('/login_signup/background.png')`,
  height: '100vh',
  width: '100vw',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  left: 0,
}));

export const NadiaPic = styled(Box)(({ theme }) => ({
  backgroundImage: `url('/login_signup/nadia_pic_intro.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '15px 15px 0 0',
  position: 'relative',
  width: '480px',
  height: '350px',
}));

export const NameLabel = styled(Typography)(({ theme }) => ({
  background: '#FB5A3F',
  borderRadius: '24px',
  textTransform: 'uppercase',
  left: 0,
  position: 'relative',
  marginTop: '-15px',
  marginLeft: '-270px',
  padding: '4px 16px',
  fontWeight: 800,
  color: 'white',
}));
