import React from 'react';
import { ShortStyledTextField, LongStyledTextField } from './StyledTextField';
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
      {variant === 'short' ? (
        <ShortStyledTextField
          multiline={multiline}
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          {...props}
        >
          {children}
        </ShortStyledTextField>
      ) : (
        <LongStyledTextField
          multiline={multiline}
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          {...props}
        >
          {children}
        </LongStyledTextField>
      )}
    </Box>
  );
};

GeneralTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['short', 'long']),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

GeneralTextField.defaultProps = {
  label: 'Label:',
  name: 'label',
  variant: 'short',
  placeholder: 'label',
  onChange: undefined,
  disabled: false,
};
