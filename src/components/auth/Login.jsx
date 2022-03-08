import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import {
  LoginTextfield,
  LoginButton,
  LoginFormSection,
  LoginBackground,
} from '../styled/auth';
import { Link } from 'react-router-dom';

const Login = () => {
  const { loginOnlyFacilitators } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      const email = formData.email;
      const password = formData.password;
      try {
        await loginOnlyFacilitators(email, password);
        navigate('/');
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, loginOnlyFacilitators, formData]
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

        <form onSubmit={handleLogin}>
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
            <Link to='/signup' style={{ textDecoration: 'unset' }}>
              <Typography variant='subtitle1'>Forgot your password?</Typography>
            </Link>
            <LoginButton
              type='submit'
              variant='contained'
              color='primary'
              onClick={handleLogin}
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
