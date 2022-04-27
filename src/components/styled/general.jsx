import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

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

// column flex box align center
export const FlexBoxCenterColumnAlign = styled(Box)(({theme}) => ({
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  flexDirection: "column", 
}))

// space between flex box
export const FlexBoxSpaceBetween = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

// space evenly flex box
export const FlexBoxSpaceEvenly = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
}));

// flex box
export const FlexBox = styled(Box)(({theme}) => ({
  display: "flex", 
  alignItems: "flex-start", 
  
})) 






