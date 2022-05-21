import React from 'react';
import { StyledBreadcrumbs, StyledBreadcrumbLinks } from './StyledBreadcrumbs';
import { NavigateNext } from '@mui/icons-material';
import { Typography } from '@mui/material';

export const GeneralBreadcrumbs = ({ breadcrumbItems }) => {
  return (
    <StyledBreadcrumbs
      separator={<NavigateNext fontSize='small' />}
      aria-label='breadcrumb'
    >
      {breadcrumbItems.map((item, idx) => {
        return item.link ? (
          <StyledBreadcrumbLinks key={idx} to={item.link}>
            <Typography variant='h4'>{item.label}</Typography>
          </StyledBreadcrumbLinks>
        ) : (
          <Typography key={idx} variant='h4' sx={{ color: 'black' }}>
            {item.label}
          </Typography>
        );
      })}
    </StyledBreadcrumbs>
  );
};
