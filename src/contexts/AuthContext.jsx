import React, { useEffect, useState, useContext } from 'react';
import { auth } from '../firebase';

const AuthContext = React.createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggingInFacilitator, setIsLoggingInFacilitator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signUp = async (email, password) => {
    return await auth.createUserWithEmailAndPassword(email, password);
  };

  const loginEmail = async (email, password) => {
    setIsLoggingInFacilitator(true);
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    setIsLoggingInFacilitator(false);
    return userCredential;
  };

  const logout = async () => {
    return await auth.signOut();
  };

  const resetPassword = async (email) => {
    return await auth.sendPasswordResetEmail(email);
  };

  const deleteUser = async () => {
    return await auth.currentUser.delete();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const { uid, ...rest } = user || {};
      const nextCurrentUser = user
        ? {
            ...rest,
            id: uid,
          }
        : null;
      setCurrentUser(nextCurrentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    // isLoggingInFacilitator,
    signUp,
    loginEmail,
    logout,
    resetPassword,
    deleteUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
