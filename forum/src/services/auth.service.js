import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../config/firebase-config';

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
