import React, { useState } from 'react';
import { LineStyle, Logout, Person } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <React.Fragment key={'left'}>
      <Button
        onClick={() => setIsDrawerOpen(true)}
        sx={{ color: 'midnight.60' }}
      >
        <Avatar
          alt={currentUser.displayName}
          src={currentUser.photoURL}
          sx={{ width: 30, height: 30 }}
        />
      </Button>
      <SwipeableDrawer
        anchor={'right'}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <Box style={{ width: 250 }} onClick={() => setIsDrawerOpen(false)}>
          <List>
            <ListItem button onClick={() => navigate('/')}>
              <ListItemIcon>
                <LineStyle />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItem>
            <ListItem button onClick={() => navigate('/profilebuilder')}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText>Profile Builder</ListItemText>
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
};
