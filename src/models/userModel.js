import { firestore } from '../firebase';

export const createDbUserIfNotExists = async (id, email, school) => {
  const obj = {
    id,
    email,
    school,
    teacherClassrooms: [],
  };
  try {
    const userRef = firestore.collection('users').doc(obj.id);
    const user = await userRef.get();
    if (user.exists) {
      // Give the existing user new teacher fields
      await userRef.update(obj, { merge: true });
    } else {
      // Create the new teacher
      await userRef.set(obj);
    }
  } catch (err) {
    throw new Error(`Error at createDbUserIfNotExists: ${err}`);
  }
}

/**
 * Checks if the user is a teacher.
 * User is considered a teacher if its `school` and `teacherClassrooms` fields are defined.
 */
export const checkDbUserIsTeacher = async (id) => {
  try {
    const user = await firestore.collection('users').doc(id).get();
    const userData = user.data();
    if (userData.school === undefined || userData.teacherClassrooms === undefined) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
