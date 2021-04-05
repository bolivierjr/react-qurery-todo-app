import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import firebaseConfig from '../config/firebase';

firebase.initializeApp(firebaseConfig);
const googleProvider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();

export const db = firebase.database();

export const signInWithGoogle = async () => {
  return await auth.signInWithRedirect(googleProvider);
};

export const signOutOfGoogle = async () => {
  await auth.signOut();
};
