import { styled } from '@mui/material/styles';
import { ToggleButtonGroup } from '@mui/material';

export const HomeToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: '0 12px 0 0',
    border: 'solid 1px black',
    borderRadius: '50px',
    minWidth: '100px',
    padding: '4px 12px',
    color: 'black',
    '&:not(:first-of-type)': {
      borderRadius: '50px',
      border: 'solid 1px black',
    },
    '&:first-of-type': {
      borderRadius: '50px',
    },
    '&.Mui-selected': {
      border: 0,
      color: 'white',
      backgroundColor: '#3DCAD3',
    },
  },
}));
