import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Home from './components/dashboard/Home';
import NewRoom from './components/dashboard/NewRoom';
import AuthLayout from './components/auth/AuthLayout';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RequireAuth><DashboardLayout/></RequireAuth>}>
            <Route exact path='/' element={<Home/>} />
            <Route path='newroom' element={<NewRoom/>} />
          </Route>
          <Route element={<AuthLayout/>}>
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<SignUp/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
