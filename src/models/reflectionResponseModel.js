import { firestore } from '../firebase';

/**
 * Gets reflection responses for a given room code.
 * `reflectionId`: optional number for filtering for reflectionId
 * `getOnlyReflections`: optional boolean for getting only verbatim (long-form) reflections
 */
export const getDbReflectionResponses = async (
  roomCode,
  reflectionId,
  getOnlyReflections
) => {
  try {
    reflectionId = parseInt(reflectionId);
    let query = firestore
      .collection('reflectionResponses')
      .where('roomCode', '==', roomCode);
    if (reflectionId) {
      query = query.where('reflectionId', '==', reflectionId);
    }
    if (getOnlyReflections) {
      query = query.where('questionId', '==', 3);
    }
    const snapshot = await query.get();
    const savedStates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return savedStates;
  } catch (err) {
    throw new Error(`Error at getDbReflectionResponses: ${err}`);
  }
};
