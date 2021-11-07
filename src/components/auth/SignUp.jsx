import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { createDbUserIfNotExists } from '../../models/userModel';

const SignUp = () => {
  const { signUp, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // TODO: what to do with isLoading?

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      const { email, password, school } = event.target.elements;
      try {
        // Try to sign up, if user does not exist
        const userCredential = await signUp(email.value, password.value);
        await createDbUserIfNotExists(userCredential.user.uid, userCredential.user.email, school.value);
        navigate('/');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          try {
            // Try to sign in, if user exists
            const userCredential = await login(email.value, password.value);
            await createDbUserIfNotExists(userCredential.user.uid, userCredential.user.email, school.value);
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
    [navigate, signUp]
  );

  // TODO: validate form fields
  return (
    <div>
      <h1>Create an account</h1>
      <form onSubmit={handleSignUp}>
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
        <label>
          School:
          <br/>
          <input name='school' type='text' placeholder='Enter full name of school here' disabled={isLoading} />
        </label>
        <br/>
        <button type='submit' disabled={isLoading}>Create an account</button>
      </form>
    </div>
  );
};

export default SignUp;
