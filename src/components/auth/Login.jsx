import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, TextField } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { loginOnlyFacilitators } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value.trim() });
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
    <Box>
      <h1>Facilitator Dashboard</h1>
      <form onSubmit={handleLogin}>
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            name='email'
            label='Email'
            type='email'
            variant='filled'
            onChange={handleChange}
            disabled={isLoading}
          />
          <TextField
            name='password'
            label='Password'
            type='password'
            variant='filled'
            onChange={handleChange}
            disabled={isLoading}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            onClick={handleLogin}
            disabled={isLoading}
            style={{ marginTop: 10 }}
          >
            Log In
          </Button>
        </Box>
      </form>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/signup')}>Don't have an account? Sign up here.</p>
    </Box>
  );
};

export default Login;
