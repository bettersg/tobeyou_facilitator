import { styled } from '@mui/material/styles';
import { Select } from '@mui/material';

export const StyledSelect = styled(Select)(({theme}) => ({
    margin: "8px 0", 
    borderRadius: "4px", 
    minWidth: "200px", 
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: "unset", 
      '&:before' : {
      }
    }, 
    '&:before' : {
      borderBottom: "unset"
    }, 
    'label + &': {
      marginTop: theme.spacing(3),
    },
    
    '& .MuiSelect-select': {
      borderRadius: 4,
      position: 'unset',
      backgroundColor: "#F5F4FD",
      borderBottom: "0px", 
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      '&:focus': {
        border: '0px',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
  
    },
    
    '& .MuiInputBase-root': {
      '&:before' : {
        borderBottom:"unset !important"
      }
    }
  })) 