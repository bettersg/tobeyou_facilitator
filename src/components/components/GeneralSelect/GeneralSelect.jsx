import React from "react"; 
import { StyledSelect } from "./StyledSelect";
import { Typography, Box } from '@mui/material';

export const GeneralSelect = ({label, children, ...props}) => {
    return (
      <Box>
        <Typography variant="h6">{label}</Typography>
        <StyledSelect
            {...props}
        >
          {children}
        </StyledSelect>
      </Box>
    )
}
