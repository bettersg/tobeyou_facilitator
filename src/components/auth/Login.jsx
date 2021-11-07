import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { loginOnlyTeachers } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // TODO: what to do with isLoading?

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      const { email, password } = event.target.elements;
      try {
        await loginOnlyTeachers(email.value, password.value);
        navigate('/');
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, loginOnlyTeachers]
  );

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <br/>
          <input name='email' type='email' placeholder='Your@emailaddress.com' disabled={isLoading} />
        </label>
        <br/>
        <label>
          Password:
          <br/>
          <input name='password' type='password' placeholder='Enter password here' disabled={isLoading} />
        </label>
        <br/>
        <button type='submit' disabled={isLoading}>Log In</button>
        <br/>
        <p style={{ cursor: 'pointer' }} onClick={() => navigate('/signup')}>Don't have an account? Sign up here.</p>
      </form>
    </div>
  );
};

export default Login;
