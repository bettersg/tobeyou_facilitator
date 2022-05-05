import React from 'react';
import { Outlet, BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './page/DashboardLayout';
import Home from './page/Home';
import Room from './page/Room';
import GameChoices from './page/GameChoices';
import Reflections from './page/Reflections';
import Quizzes from './page/Quizzes';
import EngagementLevels from './page/EngagementLevels';
import ProfileBuilder from './page/ProfileBuilder';
import AuthLayout from './page/AuthLayout';
import Login from './page/Login';
import SignUp from './page/SignUp';
import ForgetPassword from './page/ForgetPassword';
import RequireAuth from './page/RequireAuth';

import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'special' },
          style: {
            backgroundColor: '#3DCAD3',
            backgroundImage: `url('/general/SpecialButton.png')`,
            color: 'white',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minWidth: '160px',
            padding: '12px',
            '&:hover': {
              backgroundColor: '#39A2A9',
            },
          },
        },
      ],
    },
  },
  palette: {
    text: {
      primary: '#172153',
    },
    primary: {
      main: '#664EFC',
    },
    secondary: blue,
    midnight: {
      10: '#E8E9EE',
      20: '#D1D3DD',
      60: '#747A98',
      80: '#464E75',
      100: '#172153',
    },
    aqua: {
      1: '#19A3AD',
      100: '#3DCAD3',
    },
    lapis: {
      0: '#664EFC',
      10: '#F0F1FC',
      20: '#E2E2F8',
      40: '#C4C6F1',
      100: '#6C70DD',
    },
    chicky: {
      100: '#FFE55E',
    },
    grey: {
      0: '#F5F4FD',
    },
    lemongrass: {
      dark1: '#8DC000',
      dark2: '#4B7C24',
      20: '#F5FBDE',
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
    h3: {
      fontWeight: 700,
      fontSize: 28,
    },
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
      color: '#464E75',
    },
    subtitle2: {
      marginTop: '10px',
      fontSize: 12,
      textAlign: 'center',
    },
    subtitle1: {
      fontSize: 12,
      color: '#464E75',
    },
    button: {
      textTransform: 'unset',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path='/'
                element={
                  <RequireAuth>
                    <DashboardLayout />
                  </RequireAuth>
                }
              >
                <Route exact path='/' element={<Home />} />
                <Route path='/room/:roomCode/'>
                  <Route path='' element={<Room />} />
                  <Route path='reflectionId/:reflectionId'>
                    <Route path='gameChoices' element={<GameChoices />} />
                    <Route path='reflections' element={<Reflections />} />
                    <Route path='quizzes' element={<Quizzes />} />
                    <Route
                      path='engagementLevels'
                      element={<EngagementLevels />}
                    />
                  </Route>
                </Route>
              </Route>
              <Route
                element={
                  <RequireAuth>
                    <Outlet />
                  </RequireAuth>
                }
              >
                <Route path='/profilebuilder' element={<ProfileBuilder />} />
              </Route>
              <Route element={<AuthLayout />}>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/forget-password' element={<ForgetPassword />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  );
}

export default App;
