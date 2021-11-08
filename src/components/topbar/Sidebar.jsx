import React, { useState } from 'react';
import { Add, Menu, LineStyle } from '@material-ui/icons';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@material-ui/core';
import { useNavigate } from 'react-router';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <React.Fragment key={'left'}>
      <Button onClick={() => setIsDrawerOpen(true)}><Menu/></Button>
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
            <ListItem button onClick={() => navigate('/newroom')}>
              <ListItemIcon><Add/></ListItemIcon>
              <ListItemText>New Room</ListItemText>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
};

export default Sidebar;
