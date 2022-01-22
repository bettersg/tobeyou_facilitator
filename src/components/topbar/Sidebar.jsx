import React, { useState } from 'react';
import { LineStyle, Logout, Menu, Person } from '@mui/icons-material';
import {
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

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <React.Fragment key={'left'}>
      <Button onClick={() => setIsDrawerOpen(true)} sx={{color:"white"}}><Menu/></Button>
      <SwipeableDrawer
        anchor={'left'}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <Box
          style={{ width: 250 }}
          onClick={() => setIsDrawerOpen(false)}
        >
          <List>
            <ListItem button onClick={() => navigate('/')}>
              <ListItemIcon><LineStyle/></ListItemIcon>
              <ListItemText>Home</ListItemText>
            </ListItem>
            <ListItem button onClick={() => navigate('/profilebuilder')}>
              <ListItemIcon><Person/></ListItemIcon>
              <ListItemText>Profile Builder</ListItemText>
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemIcon><Logout/></ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
};

export default Sidebar;
