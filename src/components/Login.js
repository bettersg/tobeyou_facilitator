import React, { useCallback } from 'react';
import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';
import app from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app.auth().signInWithEmailAndPassword(email.value, password.value);
        navigate('/');
      } catch (error) {
        alert(error);
      }
    },
    [navigate]
  );

  if (currentUser) {
    return <Navigate to='/' />;
  }

  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name='email' type='email' placeholder='Email' />
        </label>
        <br/>
        <label>
          Password
          <input name='password' type='password' placeholder='Password' />
        </label>
        <button type='submit'>Log In</button>
      </form>
    </div>
  );
};

export default Login;
