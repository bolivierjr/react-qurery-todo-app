import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../config/firebase';

firebase.initializeApp(firebaseConfig);
const googleProvider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();

export const signInWithGoogle = async () => {
  try {
    const userResult = await auth.signInWithRedirect(googleProvider);
    return userResult;
  } catch (error) {
    console.log({ error: error.message });
  }
};

export const signOutOfGoogle = async () => {
  await auth.signOut();
};
