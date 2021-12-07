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

import { createTheme, StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { deepPurple, blue } from '@mui/material/colors';

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
      fontSize: 20, 
    }, 
    h5: {
      fontWeight: 800,
      fontSize: 14, 
    }, 
    h6: {
      fontWeight: 700, 
      fontSize: 12, 
      color: "#464E75", 
    },
  }
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<RequireAuth><DashboardLayout/></RequireAuth>}>
                <Route exact path='/' element={<Home/>} />
                <Route path='/r oom/:roomId' element={<Room/>} />
              </Route>
              <Route element={<AuthLayout/>}>
                <Route path='/login' element={<Login/>} />
                <Route path='/signup' element={<SignUp/>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  );
}

export default App;
