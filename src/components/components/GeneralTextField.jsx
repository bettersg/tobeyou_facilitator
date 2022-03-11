import React from "react"; 
import { StyledTextfield } from "../styled/general";
import PropTypes from 'prop-types';
import { Box, Button, TextField, Typography, InputBase } from '@mui/material';

export const GeneralTextField = ({select,value, label, name, variant, placeholder, onChange, disabled, children,  ...props}) => {
    return (
      <Box>
        <Typography variant="h6">{label}</Typography>
        <StyledTextfield
            select
            value={value}
            name="organisation"
            variant="filled"
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            {...props}
        >
          {children}
        </StyledTextfield>
      </Box>
    )
}

GeneralTextField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['filled']),
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
  };

GeneralTextField.defaultProps = {
  // label: "Label:",
  // name: "sample text box",
  variant: 'filled',
  select: false, 
//   placeholder: "default text here",
  // onChange: undefined,
  disabled: false
};