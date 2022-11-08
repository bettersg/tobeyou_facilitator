import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = firebase.initializeApp(config);

export default app;

export const auth = firebase.auth();
export const googleAuthProviderId =
  firebase.auth.GoogleAuthProvider.PROVIDER_ID;
export const facebookAuthProviderId =
  firebase.auth.FacebookAuthProvider.PROVIDER_ID;
export const firestore = firebase.firestore();
export const functions = firebase.functions();
