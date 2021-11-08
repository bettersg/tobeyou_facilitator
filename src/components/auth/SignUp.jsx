import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, TextField } from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';
import { createDbUserIfNotExists } from '../../models/userModel';

const SignUp = () => {
  const { signUp, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    school: '',
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value.trim() });
  };

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      // TODO: validate form fields
      const email = formData.email;
      const password = formData.password;
      const school = formData.school;

      try {
        // Try to sign up, if user does not exist
        const userCredential = await signUp(email, password);
        await createDbUserIfNotExists(userCredential.user.uid, userCredential.user.email, school);
        navigate('/');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          try {
            // Try to sign in, if user exists
            const userCredential = await login(email, password);
            await createDbUserIfNotExists(userCredential.user.uid, userCredential.user.email, school);
            navigate('/');
            // TODO: what if the user exists, and is already a teacher? Should throw an error, right?
          } catch (error) {
            alert(error);
          }
        } else {
          alert(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, signUp, login, formData]
  );

  return (
    <Box>
      <h1>Create an account</h1>
      <form onSubmit={handleSignUp}>
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
          <TextField
            name='school'
            label='School'
            type='text'
            variant='filled'
            onChange={handleChange}
            disabled={isLoading}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            onClick={handleSignUp}
            disabled={isLoading}
            style={{ marginTop: 10 }}
          >
            Create
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SignUp;
