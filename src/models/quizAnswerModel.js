import { firestore } from '../firebase';

export const getDbQuizAnswers = async (participantRoomId) => {
  try {
    const snapshot = await firestore
      .collection('quizAnswers')
      .where('participantRoomIds', 'array-contains', participantRoomId)
      .get();
    const savedStates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return savedStates;
  } catch (err) {
    throw new Error(`Error at getDbQuizAnswers: ${err}`)
  }
}
