import { styled } from '@mui/material/styles';
import { ToggleButtonGroup } from '@mui/material';

export const HomeToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: '0 12px 0 0',
    border: `solid 1px ${theme.palette.lapis[10]}`,
    borderRadius: '50px',
    padding: '4px 12px',
    color: theme.palette.lapis[100],
    fontWeight: "700", 
    '&:not(:first-of-type)': {
      borderRadius: '50px',
      backgroundColor: theme.palette.lapis[10],
    },
    '&:first-of-type': {
      borderRadius: '50px',
    },
    '&.Mui-selected': {
      border: 0,
      color: 'white',
      backgroundColor: theme.palette.lapis[100],
    },
  },
}));
