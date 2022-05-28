import React from 'react';
import { StyledSelect } from './StyledSelect';
import { Typography, Box, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';

export const GeneralSelect = ({ label, children, ...props }) => {
  return (
    <Box>
      <Typography variant='h6'>{label}</Typography>
      <StyledSelect {...props}>{children}</StyledSelect>
    </Box>
  );
};

GeneralSelect.propTypes = {
  label: PropTypes.string,
  children: PropTypes.any,
};

GeneralSelect.defaultProps = {
  label: 'Select',
  children: (
    <MenuItem key={1} value={'option1'}>
      option 1
    </MenuItem>
  ),
};
