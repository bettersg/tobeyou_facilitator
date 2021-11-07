import React from 'react';
import app from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  return (
    <>
      <h1>Home</h1>
      <p>Logged in as {currentUser.email}</p>
      <button onClick={() => app.auth().signOut()}>Sign Out</button>
    </>
  );
};

export default Home;
