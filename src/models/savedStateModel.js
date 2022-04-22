import { firestore } from '../firebase';

// TODO: to review - might not need to filter by room code after all.
export const getDbSavedStates = async (roomCode) => {
  try {
    const snapshot = await firestore
      .collection('savedStates')
      .where('roomCode', '==', roomCode)
      .get();
    const savedStates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return savedStates;
  } catch (err) {
    throw new Error(`Error at getDbSavedStates: ${err}`);
  }
};
