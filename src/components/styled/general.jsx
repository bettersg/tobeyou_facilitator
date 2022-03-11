import { alpha, styled } from '@mui/material/styles';
import { Box, Button, TextField, Typography, InputBase } from '@mui/material';
import Select from '@mui/material/Select';
import SelectUnstyled from '@mui/base/SelectUnstyled';

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

// export const GeneralTextfield = styled(InputBase)(({theme}) => ({
//     'label + &': {
//       marginTop: theme.spacing(3),
//     },
//     width: 250,
//     height: 32, 
//     margin: "4px 0 16px 0",
//     input: {
//       borderRadius: 8,
//       backgroundColor: "#E7E4F9",
//       fontSize: 15,
      

//       padding: '8px 8px',
//       transition: theme.transitions.create(['border-color', 'box-shadow']),
//       '&:focus': {
//         boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
//         borderColor: theme.palette.primary.main,
//       },
//     },
  
// })) 

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

export const StyledSelect = styled(Select)(({theme}) => ({
  margin: "8px 0", 
  borderRadius: "4px", 
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

export const StyledButton = styled(Button)(({theme}) => ({
    borderRadius: "50px", 

})) 
