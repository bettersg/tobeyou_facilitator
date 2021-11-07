import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import RequireAuth from './components/RequireAuth';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<RequireAuth><Home/></RequireAuth>} />
          <Route exact path='/login' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
