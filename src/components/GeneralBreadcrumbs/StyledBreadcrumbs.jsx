import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Breadcrumbs } from '@mui/material';

export const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({}));

export const StyledBreadcrumbLinks = styled(Link)(({ theme }) => ({
  color: 'black',
  textDecoration: 'none',
}));
