import React from 'react';
import { Outlet, BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Home from './components/dashboard/Home';
import Room from './components/dashboard/Room';
import CompletionRate from './components/dashboard/CompletionRate';
import Reflections from './components/dashboard/Reflections';
import Quizzes from './components/dashboard/Quizzes';
import ProfileBuilder from './components/auth/ProfileBuilder';
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
    subtitle2: {
      marginTop: "10px", 
      fontSize: 12, 
      textAlign: "center"
    }, 
    subtitle1: {
      fontSize: 12, 
      color: "#464E75", 
    }, 
    button: {
      textTransform: "unset", 
    }
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
                <Route path='/room/:roomId/reflectionId/:reflectionId'>
                  <Route path='' element={<Room/>} />
                  <Route path='completionRate' element={<CompletionRate/>} />
                  <Route path='reflections' element={<Reflections/>} />
                  <Route path='quizzes' element={<Quizzes/>} />
                </Route>
              </Route>
              <Route element={<RequireAuth><Outlet/></RequireAuth>}>
                <Route path='/profilebuilder' element={<ProfileBuilder/>} />
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
