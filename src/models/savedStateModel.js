import { firestore } from '../firebase';

export const getDbSavedStates = async (participantRoomId) => {
  try {
    const snapshot = await firestore
      .collection('savedStates')
      .where('participantRoomIds', 'array-contains', participantRoomId)
      .get();
    const savedStates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return savedStates;
  } catch (err) {
    throw new Error(`Error at getDbSavedStates: ${err}`)
  }
}
