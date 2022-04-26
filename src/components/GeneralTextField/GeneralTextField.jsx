import React from 'react';
import { StyledTextfield } from './StyledTextField';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

export const GeneralTextField = ({
  select,
  value,
  label,
  name,
  variant,
  placeholder,
  onChange,
  disabled,
  children,
  multiline,
  ...props
}) => {
  return (
    <Box>
      <Typography variant='h6'>{label}</Typography>

      <StyledTextfield
        select
        multiline={multiline}
        value={value}
        name={name}
        variant='filled'
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        {children}
      </StyledTextfield>
    </Box>
  );
};

GeneralTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['filled']),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

GeneralTextField.defaultProps = {
  label: 'Label:',
  name: 'label',
  variant: 'filled',
  placeholder: 'label',
  onChange: undefined,
  disabled: false,
};
