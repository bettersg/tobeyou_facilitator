import React, { useEffect, useState, useContext } from 'react';
import { auth } from '../firebase';
import { getDbUser } from '../models/userModel';

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

  const login = async (email, password) => {
    return await auth.signInWithEmailAndPassword(email, password);
  };

  /**
   * Logs in the user only if they have already been registered as a facilitator.
   */
  const loginOnlyFacilitators = async (email, password) => {
    setIsLoggingInFacilitator(true);
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );

    // Check if the user is a facilitator, and sign them out if they're not
    // We must first sign in the user to check this, because of our firestore auth rules
    const userId = userCredential.user.uid;
    const user = await getDbUser(userId);
    if (!user.isFacilitator) {
      await auth.signOut();
      throw new Error(
        'The user exists, but is not registered as a facilitator yet.'
      );
    }

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
    isLoggingInFacilitator,
    signUp,
    login,
    loginOnlyFacilitators,
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
