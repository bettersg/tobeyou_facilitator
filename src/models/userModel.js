import { firestore } from '../firebase';

/**
 * Creates a user and sets it to be a facilitator, if the user does not exist.
 */
export const createDbUserIfNotExists = async (id, email) => {
  const userObj = { id };
  const emailObj = { email };

  try {
    const userRef = firestore.collection('users').doc(userObj.id);
    const emailRef = firestore.collection('emails').doc(userObj.id);
    const user = await userRef.get();
    if (user.exists) {
      // Give the existing user new facilitator fields
      await userRef.update(userObj, { merge: true });
      await emailRef.update(emailObj, { merge: true });
    } else {
      // Create the new facilitator
      await userRef.set(userObj);
      await emailRef.set(emailObj);
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
