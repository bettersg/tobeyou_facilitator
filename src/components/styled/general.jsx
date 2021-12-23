import { alpha, styled } from '@mui/material/styles';
import { Box, Button, TextField, Typography, InputBase } from '@mui/material';

// general flex box 
export const FlexBoxCenter = styled(Box)(({theme}) => ({
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
})) 

// space between flex box
export const FlexBoxSpaceBetween = styled(Box)(({theme}) => ({
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
})) 