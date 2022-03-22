import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Sidebar } from '../Sidebar';
import { StyledTopbar, NavbarText } from './StyledTopbar';
import { FlexBoxCenter } from '../../styled/general';
import "./style.scss"

export const Topbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  return (
    <StyledTopbar>
      <img src="/general/logo.png" width="60" onClick={() => navigate('/')} className="Topbar__logo"/>
      <FlexBoxCenter>
        <NavbarText variant="body2">Play Game</NavbarText>
        <NavbarText variant="body2">Lesson Plan</NavbarText>
        <NavbarText onClick={logout}>{ currentUser.displayName }</NavbarText>
        <Sidebar/>
      </FlexBoxCenter>
    </StyledTopbar>

  );
};
