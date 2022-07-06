import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import {
  LoginButton,
  LoginFormSection,
  LoginBackground,
} from '../components/styled/auth';
import { GeneralTextField } from '../components/GeneralTextField/GeneralTextField';
import { createDbUserIfNotExists, getDbUser } from '../models/userModel';

import {
  auth,
  googleAuthProviderId,
  facebookAuthProviderId,
} from '../firebase';

const Login = () => {
  const { loginEmail } = useAuth();
  const { setSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const firebaseUIConfig = {
    signInFlow: 'redirect',
    signInOptions: [googleAuthProviderId, facebookAuthProviderId],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        const userId = authResult.user.uid;
        const email = authResult.user.email;
        handleAfterLogin(userId, email);
        return false;
      },
    },
  };

  const handleAfterLogin = async (userId, email) => {
    await createDbUserIfNotExists(userId, email);
    const dbUser = await getDbUser(userId);
    if (dbUser.isFacilitator) {
      navigate('/');
    } else {
      navigate('/profilebuilder');
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleLoginEmail = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      const email = formData.email;
      const password = formData.password;
      try {
        const userCredential = await loginEmail(email, password);
        const userId = userCredential.user.uid;
        await handleAfterLogin(userId, email);
      } catch (error) {
        setSnackbar({
          message: error.message,
          open: true,
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, loginEmail, formData]
  );

  return (
    <LoginBackground>
      <LoginFormSection>
        <Typography variant='h4' color='primary' align='center'>
          Facilitator Dashboard
        </Typography>
        <Typography
          variant='h5'
          align='center'
          style={{ marginBottom: '20px' }}
        >
          Log in
        </Typography>

        <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />

        <form onSubmit={handleLoginEmail}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <GeneralTextField
              name='email'
              label='Email:'
              defaultValue='example@email.com'
              onChange={handleChange}
              disabled={isLoading}
            />
            <GeneralTextField
              name='password'
              label='Password:'
              type='password'
              onChange={handleChange}
              disabled={isLoading}
            />
            <Link to='/forget-password' style={{ textDecoration: 'unset' }}>
              <Typography variant='subtitle1'>Forgot your password?</Typography>
            </Link>
            <LoginButton
              type='submit'
              variant='contained'
              color='primary'
              onClick={handleLoginEmail}
              disabled={isLoading}
              style={{ marginTop: 10 }}
            >
              Login
            </LoginButton>
            <Link to='/signup' style={{ color: 'black' }}>
              <Typography variant='subtitle2'>
                Don&apos;t have an account? Sign up here.
              </Typography>
            </Link>
          </Box>
        </form>
        <Typography variant='subtitle1' style={{ marginTop: 12 }}>
          This site is optimized for desktops or tablets
          <br />
          and is not mobile friendly.
        </Typography>
      </LoginFormSection>
      <img
        src='/login_signup/logo.png'
        width='200'
        style={{ position: 'absolute', top: 10, left: 20 }}
      />
      <img
        src='/login_signup/characters.png'
        width='400'
        style={{ position: 'absolute', bottom: 0, right: 0 }}
      />
    </LoginBackground>
  );
};

export default Login;
