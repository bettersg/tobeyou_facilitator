import { firestore } from '../firebase';

export const getDbReflectionResponses = async (participantRoomId, reflectionId, getOnlyReflections) => {
  try {
    reflectionId = parseInt(reflectionId);
    let query = firestore
      .collection('reflectionResponses')
      .where('participantRoomIds', 'array-contains', participantRoomId)
      .where('reflectionId', '==', reflectionId);
    if (getOnlyReflections) {
      query = query.where('questionId', '==', 3)
    }
    const snapshot = await query.get();
    const savedStates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return savedStates;
  } catch (err) {
    throw new Error(`Error at getDbReflectionResponses: ${err}`)
  }
}
