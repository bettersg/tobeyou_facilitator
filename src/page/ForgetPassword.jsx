import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import {
  LoginButton,
  LoginFormSection,
  LoginBackground,
} from '../components/styled/auth';
import { GeneralTextField } from '../components/GeneralTextField/GeneralTextField';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
  const { resetPassword } = useAuth();
  const { setSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      const email = formData.email;
      try {
        await resetPassword(email);
        navigate('/');
        setSnackbar({
          message: 'Success! Check your inbox for further instructions.',
          open: true,
          type: 'success',
        });
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
    [navigate, formData]
  );

  // TODO: refactor to reduce duplication across login, sign-up, and forget password pages
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
          Password Reset
        </Typography>

        <form onSubmit={handleSubmit}>
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
              placeholder='Your email here'
              onChange={handleChange}
              disabled={isLoading}
            />
            <LoginButton
              type='submit'
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ marginTop: 10 }}
            >
              Submit
            </LoginButton>
            <Link to='/login' style={{ color: 'black' }}>
              <Typography variant='subtitle2'>Back to login</Typography>
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

export default ForgetPassword;
