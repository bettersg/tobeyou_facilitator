import React from 'react';
import { Outlet, BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './page/DashboardLayout';
import Home from './page/Home';
import Room from './page/Room';
import CompletionRate from './page/CompletionRate';
import Reflections from './page/Reflections';
import Quizzes from './page/Quizzes';
import ProfileBuilder from './page/ProfileBuilder';
import AuthLayout from './page/AuthLayout';
import Login from './page/Login';
import SignUp from './page/SignUp';
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
          props: { variant: "special" }, 
          style: {
            backgroundColor: "#3DCAD3", 
            backgroundImage:`url('/general/SpecialButton.png')`,  
            color: "white", 
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: "no-repeat", 
            minWidth: "160px",
            padding: "12px",  
            "&:hover": {
              backgroundColor: "#39A2A9",
            }
          }
        }
      ]
    }
  }, 
  palette: {
    primary: {
      main: '#664EFC',
    },
    secondary: blue,
    midnight: {
      60: "#747A98",
      100: "#172153", 
    }, 
    aqua: {
      1: "#19A3AD", 
      100: "#3DCAD3", 
    }, 
    lapis: {
      10: "#F0F1FC", 
      100: "#6C70DD", 
    }, 
    chicky: {
      100: '#FFE55E', 
    }
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(","),
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
                <Route path='/room/:roomId/reflectionId/:reflectionId'>
                  <Route path='' element={<Room />} />
                  <Route path='completionRate' element={<CompletionRate />} />
                  <Route path='reflections' element={<Reflections />} />
                  <Route path='quizzes' element={<Quizzes />} />
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
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  );
}

export default App;
