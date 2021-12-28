import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import { Navbar, ProfileText } from '../styled/topbar';
import { FlexBoxCenter } from '../styled/general';

const Topbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  return (
    <Navbar>
      <Sidebar/>
      <img src="/general/logo.png" width="100" onClick={() => navigate('/')} style={{cursor: 'pointer'}}/>
      <FlexBoxCenter>
        <ProfileText onClick={logout}>{ currentUser.displayName }</ProfileText>
        <img src="/navbar/profile_icon.png" style={{width: "36px", height: "36px", marginRight: "12px"}}/>
      </FlexBoxCenter>
    </Navbar>

  );
};

export default Topbar;
