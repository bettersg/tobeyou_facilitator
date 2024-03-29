import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { createDbUserIfNotExists } from '../models/userModel';
import { Link } from 'react-router-dom';
import {
  LoginTextfield,
  LoginButton,
  LoginFormSection,
  LoginBackground,
} from '../components/styled/auth';

const SignUp = () => {
  const { signUp, loginEmail } = useAuth();
  const { setSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // username: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      // TODO: validate form fields
      const email = formData.email;
      const password = formData.password;
      // const username = formData.username;

      try {
        // Try to sign up, if user does not exist
        const userCredential = await signUp(email, password);
        await createDbUserIfNotExists(
          userCredential.user.uid,
          userCredential.user.email
        );
        navigate('/profilebuilder');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          try {
            // Try to sign in, if user exists
            const userCredential = await loginEmail(email, password);
            await createDbUserIfNotExists(
              userCredential.user.uid,
              userCredential.user.email
            );
            navigate('/profilebuilder');
            // TODO: what if the user exists, and is already a facilitator? Should throw an error, right?
          } catch (error) {
            setSnackbar({
              message: error.message,
              open: true,
              type: 'error',
            });
          }
        } else {
          setSnackbar({
            message: error.message,
            open: true,
            type: 'error',
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, signUp, loginEmail, formData]
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
          Let’s get started
        </Typography>
        <form onSubmit={handleSignUp}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant='h6'>Email:</Typography>
            <LoginTextfield
              name='email'
              placeholder='Your email here'
              type='email'
              onChange={handleChange}
              disabled={isLoading}
            />
            <Typography variant='h6'>Password:</Typography>
            <LoginTextfield
              name='password'
              label='Password'
              type='password'
              variant='filled'
              onChange={handleChange}
              disabled={isLoading}
            />
            <LoginButton
              type='submit'
              variant='contained'
              color='primary'
              onClick={handleSignUp}
              disabled={isLoading}
              style={{ marginTop: 10 }}
            >
              Create an account
            </LoginButton>
            <Link to='/login' style={{ color: 'black' }}>
              <Typography variant='subtitle2'>
                Already have an account? Log in here.
              </Typography>
            </Link>
          </Box>
        </form>
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

export default SignUp;
