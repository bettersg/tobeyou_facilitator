import React, { useEffect, useState, useContext } from 'react';
import { auth } from '../firebase';
import { checkDbUserIsTeacher } from '../models/userModel';

const AuthContext = React.createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggingInTeacher, setIsLoggingInTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const signUp = async (email, password) => {
    return await auth.createUserWithEmailAndPassword(email, password);
  }

  const login = async (email, password) => {
    return await auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Logs in the user only if they have been properly registered as a teacher.
   */
  const loginOnlyTeachers = async (email, password) => {
    // TODO: this approach is hacky and requires signing in twice. Is there a better way?
    setIsLoggingInTeacher(true);
    // Sign in the first time just to get the user's ID, and use it to check if they're a teacher
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;
    // Sign out immediately to avoid 'wrongfully' signing them in if they're not actually a teacher
    await auth.signOut();
    const isTeacher = await checkDbUserIsTeacher(userId);

    if (!isTeacher) {
      throw new Error('The user exists, but is not registered as a teacher yet.');
    }

    // User is actually a teacher, so sign them in proper the second time
    await auth.signInWithEmailAndPassword(email, password);
    setIsLoggingInTeacher(false);
    return userCredential;
  }

  const logout = async () => {
    return await auth.signOut();
  }

  const resetPassword = async (email) => {
    return await auth.sendPasswordResetEmail(email);
  }

  const deleteUser = async () => {
    return await auth.currentUser.delete();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const { uid, ...rest } = user || {}
      const nextCurrentUser = user ? {
        ...rest,
        id: uid,
      } : null
      setCurrentUser(nextCurrentUser);
      setIsLoading(false);
    })

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isLoggingInTeacher,
    signUp,
    login,
    loginOnlyTeachers,
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
