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
    const reflectionResponses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return reflectionResponses;
  } catch (err) {
    throw new Error(`Error at getDbReflectionResponses: ${err}`);
  }
};

export const getDbEngagementLevels = async (roomCode, reflectionId) => {
  try {
    const snapshot = await firestore
      .collection('reflectionResponses')
      .where('roomCode', '==', roomCode)
      .where('reflectionId', '==', reflectionId)
      .where('questionId', '==', 2)
      .get();
    const engagementLevels = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return engagementLevels;
  } catch (err) {
    throw new Error(`Error at getDbEngagementLevels: ${err}`);
  }
};
