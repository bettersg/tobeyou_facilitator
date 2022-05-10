import React, { useEffect, useState } from 'react';
import { StyledBreadcrumbs, StyledBreadcrumbLinks } from './StyledBreadcrumbs';
import { NavigateNext } from '@mui/icons-material';
import { Typography, Link } from '@mui/material';

export const GeneralBreadcrumbs = ({breadcrumbItems}) => {
    return (
        <StyledBreadcrumbs
            separator={<NavigateNext fontSize='small' />}
            aria-label='breadcrumb'
        >
            {breadcrumbItems.map((item, idx) => {
                return (
                    <StyledBreadcrumbLinks key={idx} href={item.link}>
                        <Typography variant="h4">{item.label}</Typography>
                    </StyledBreadcrumbLinks>
                )
            })}
        </StyledBreadcrumbs>
    )
};
