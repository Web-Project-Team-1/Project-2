import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db, storage } from '../config/firebase-config';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

export const getUserByHandle = async (handle) => {
  const snapshot = await get(ref(db, `users/${handle}`));
  return snapshot.val();
};

export const createUserHandle = async (handle, uid, email) => {
  const user = {
    handle,
    uid,
    email,
    createdOn: new Date().toString()
  };

  await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  const data = snapshot.val();
  
  if (data) {
    const userIdKey = Object.keys(data)[0];
    const userData = data[userIdKey];
    
    return {
      ...userData,
      photoURL: userData.photoURL || null,
    };
  }
  
  return null;
};

export async function uploadProfilePicture(file, userId, handle) {
  const storagePathRef = storageRef(storage, `profilePictures/${userId}`);
  
  await uploadBytes(storagePathRef, file);
  const downloadURL = await getDownloadURL(storagePathRef);

  const userRef = ref(db, `users/${handle}`);
  await update(userRef, { photoURL: downloadURL });

  return downloadURL;
}
