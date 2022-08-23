import { firestore } from '../firebase';
import { MINI_GAME_MAP } from '../models/miniGameMap';

export const getDbQuizAnswersChartDatas = async (roomCode, gameId) => {
  // Returns the count of answers as an object, indexed by questionId then answerId
  function getAnswerCounts(answers) {
    const counts = {};
    for (const answer of answers) {
      let { questionId, answerId } = answer;
      if (counts[questionId] === undefined) {
        counts[questionId] = {};
      }
      if (counts[questionId][answerId] === undefined) {
        counts[questionId][answerId] = 1;
      } else {
        counts[questionId][answerId] += 1;
      }
    }
    return counts;
  }

  function parseChartDatas(quizAnswers) {
    const answers = quizAnswers.flatMap((x) => x.answers);
    const answerCounts = getAnswerCounts(answers);
    const chartDatas = miniGameQuestions.map((miniGameQuestion) => {
      const answerCountsForQuestion =
        answerCounts[miniGameQuestion.question_id] || {};
      const data = miniGameQuestion.answers.map((answer) => {
        return answerCountsForQuestion[answer.answer_id] || 0;
      });
      return {
        title: miniGameQuestion.question,
        labels: miniGameQuestion.answers.map((answer) => answer.title),
        data: data,
        tooltip: miniGameQuestion.explanation,
        correctAnswerIdx: miniGameQuestion.answers
          .map((answer) => answer.answer_id)
          .findIndex(
            (answerId) => answerId === miniGameQuestion.correct_answer_id
          ),
        isImage: miniGameQuestion.type === 'image',
        imageUrls: miniGameQuestion.answers.map((answer) => answer?.imageUrl),
      };
    });
    return chartDatas;
  }

  const miniGameQuestions = MINI_GAME_MAP.find(
    (game) => game.game_id === gameId
  ).questions;
  const dbQuizAnswers = await getDbQuizAnswers(roomCode, gameId); // reflectionId serves as the gameId
  const parsedChartDatas = parseChartDatas(dbQuizAnswers);
  return parsedChartDatas;
};

export const getDbQuizAnswers = async (roomCode, gameId) => {
  try {
    gameId = parseInt(gameId);
    const snapshot = await firestore
      .collection('quizAnswers')
      .where('roomCode', '==', roomCode)
      .where('gameId', '==', gameId)
      .get();
    const quizAnswers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return quizAnswers;
  } catch (err) {
    throw new Error(`Error at getDbQuizAnswers: ${err}`);
  }
};
