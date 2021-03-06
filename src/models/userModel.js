import { firestore } from '../firebase';

/**
 * Creates a user and sets it to be a facilitator, if the user does not exist.
 */
export const createDbUserIfNotExists = async (id, email) => {
  const obj = {
    id,
    email,
  };

  try {
    const userRef = firestore.collection('users').doc(obj.id);
    const user = await userRef.get();
    if (user.exists) {
      // Give the existing user new facilitator fields
      await userRef.update(obj, { merge: true });
    } else {
      // Create the new facilitator
      await userRef.set(obj);
    }
  } catch (err) {
    throw new Error(`Error at createDbUserIfNotExists: ${err}`);
  }
};

export const updateDbUser = async (id, obj, merge = true) => {
  try {
    await firestore.collection('users').doc(id).update(obj, { merge: merge });
  } catch (err) {
    throw new Error(`Error at updateDbUser: ${err}`);
  }
};

export const getDbUser = async (id) => {
  try {
    const user = await firestore.collection('users').doc(id).get();
    const userData = { id: user.id, ...user.data() };
    return userData;
  } catch (err) {
    throw new Error(`Error at getDbUser: ${err}`);
  }
};

export const getDbUserFromEmail = async (email) => {
  const snapshot = await firestore
    .collection('users')
    .where('email', '==', email)
    .get();
  if (snapshot.docs.length === 0) {
    return null;
  }
  const userDoc = snapshot.docs[0];
  const userData = { id: userDoc.id, ...userDoc.data() };
  return userData;
};
