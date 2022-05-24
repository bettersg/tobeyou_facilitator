import { alpha, styled } from '@mui/material/styles';
import { InputBase } from '@mui/material';

export const StyledTextfield = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  width: 380,
  height: 42.99,
  margin: '8px 0 16px 0',
  input: {
    borderRadius: 4,
    backgroundColor: '#F5F4FD',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
  '&.MuiInputBase-multiline': {
    height: 'auto',
    padding: 10,
    borderRadius: 4,
    background: theme.palette.grey[0],
  },
}));
