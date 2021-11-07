import React from 'react';
import Topbar from '../topbar/Topbar';
import Sidebar from '../sidebar/Sidebar';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
  return (
    <div>
      <Topbar/>
      <div className='container' style={{ display: 'flex' }}>
        <Sidebar/>
        <div className='others' style={{ flex: 4 }}>
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
