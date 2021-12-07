import { firestore } from '../firebase';

export const getDbQuizAnswers = async (participantRoomId, gameId) => {
  try {
    gameId = parseInt(gameId);
    const snapshot = await firestore
      .collection('quizAnswers')
      .where('participantRoomIds', 'array-contains', participantRoomId)
      .where('gameId', '==', gameId)
      .get();
    const quizAnswers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return quizAnswers;
  } catch (err) {
    throw new Error(`Error at getDbQuizAnswers: ${err}`)
  }
}
