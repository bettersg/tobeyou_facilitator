import React from 'react';
import { useNavigate } from 'react-router';
import './topbar.css'
import { useAuth } from '../../contexts/AuthContext';

const Topbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  return (
    <div className='topbar'>
      <div className='topbarWrapper'>
        <div className='topLeft'>
          <span className='logo' onClick={() => navigate('/')}>ToBeYou</span>
        </div>
        <div className='topRight'>
          <p>{ currentUser.email }</p>
          <button onClick={logout}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
