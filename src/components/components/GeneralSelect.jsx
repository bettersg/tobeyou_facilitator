import React from "react"; 
import { StyledSelect } from "../styled/general";
import PropTypes from 'prop-types';
import { Box, Button, TextField, Typography, InputBase } from '@mui/material';

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

// GeneralSelect.propTypes = {
//     label: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     variant: PropTypes.oneOf(['filled']),
//     placeholder: PropTypes.string,
//     onChange: PropTypes.func,
//     disabled: PropTypes.bool
//   };

//   GeneralSelect.defaultProps = {
//   // label: "Label:",
//   // name: "sample text box",
//   variant: 'filled',
//   select: false, 
// //   placeholder: "default text here",
//   // onChange: undefined,
//   disabled: false
// };