import { alpha, styled } from '@mui/material/styles';
import { Box, Button, TextField, Typography, InputBase } from '@mui/material';

// general flex box 
export const FlexBoxCenter = styled(Box)(({theme}) => ({
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
})) 

// column flex box 
export const FlexBoxCenterColumn = styled(Box)(({theme}) => ({
    display: "flex", 
    justifyContent: "center", 
    flexDirection: "column", 
}))

// space between flex box
export const FlexBoxSpaceBetween = styled(Box)(({theme}) => ({
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
})) 

// space evenly flex box
export const FlexBoxSpaceEvenly = styled(Box)(({theme}) => ({
    display: "flex", 
    justifyContent: "space-evenly", 
    alignItems: "center", 
})) 

// flex box
export const FlexBox = styled(Box)(({theme}) => ({
  display: "flex", 
  alignItems: "flex-start", 
  
})) 

export const GeneralTextfield = styled(InputBase)(({theme}) => ({
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

export const StyledButton = styled(Button)(({theme}) => ({
    borderRadius: "50px", 

})) 
