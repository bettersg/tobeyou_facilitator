import React from 'react';
import { styled } from '@mui/material/styles';
import { Button, Menu, MenuItem } from '@mui/material';

const MenuButton = styled(Button)(({ theme }) => ({
  borderRadius: '100px',
  backgroundColor: 'white',
  fontStyle: 'normal',
  fontWeight: 700,
  '&:hover': {
    backgroundColor: theme.palette.lapis[100],
    color: 'white',
  },
  margin: 2,
  padding: '6px 14px',
}));

const MenuButtonwithIcon = ({ ButtonText, Icon, Items, handleRequest }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MenuButton
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
        endIcon={Icon}
      >
        {ButtonText}
      </MenuButton>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Items.map((item) => (
          //   <MenuItem onClick={handleClose} key={item.title} value={item.title}>
          //     {item.title}
          //   </MenuItem>
          <MenuItem
            onClick={() => {
              handleRequest(item.title);
            }}
            key={item.title}
            value={item.title}
          >
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MenuButtonwithIcon;
