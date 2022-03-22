import { alpha, styled } from '@mui/material/styles';
import { InputBase } from '@mui/material';

export const StyledTextfield = styled(InputBase)(({theme}) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    width: 250,
    height: 32, 
    margin: "4px 0 16px 0",
    input: {
      borderRadius: 8,
      backgroundColor: "#E7E4F9",
      fontSize: 15,
      
      padding: '8px 8px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
  
  })) 