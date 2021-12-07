import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Home from './components/dashboard/Home';
import Room from './components/dashboard/Room';
import AuthLayout from './components/auth/AuthLayout';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import RequireAuth from './components/RequireAuth';

import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { deepPurple, blue } from '@material-ui/core/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: "#664EFC", 
    }, 
    secondary: blue, 
  },
  typography: {
    h4: {
      fontWeight: 700, 
      fontSize: "18px", 
    }, 
    h5: {
      fontWeight: 800,
      fontSize: "16px", 
    }, 
    h6: {
      fontWeight: 700, 
      fontSize: "12px", 
      color: "#464E75", 
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<RequireAuth><DashboardLayout/></RequireAuth>}>
              <Route exact path='/' element={<Home/>} />
              <Route path='/room/:roomId' element={<Room/>} />
            </Route>
            <Route element={<AuthLayout/>}>
              <Route path='/login' element={<Login/>} />
              <Route path='/signup' element={<SignUp/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
