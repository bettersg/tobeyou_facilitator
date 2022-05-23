import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbRoomByCode } from '../models/roomModel';
import { getDbQuizAnswers } from '../models/quizAnswerModel';
import { MINI_GAME_MAP } from '../models/miniGameMap';
import ChartScreen from '../components/ChartScreen/ChartScreen';

const Quizzes = () => {
  let { roomCode, reflectionId } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const miniGameQuestions = MINI_GAME_MAP.find(
    (game) => game.game_id === reflectionId
  ).questions;

  const [chartDatas, setChartDatas] = useState(null);

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

  async function getData() {
    const dbRoom = await getDbRoomByCode(roomCode);
    if (
      !dbRoom ||
      !dbRoom.facilitatorIds.includes(currentUser.id) ||
      !dbRoom.reflectionIds.includes(reflectionId)
    ) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    const dbQuizAnswers = await getDbQuizAnswers(roomCode, reflectionId); // reflectionId serves as the gameId
    const parsedChartDatas = parseChartDatas(dbQuizAnswers);
    setChartDatas(parsedChartDatas);
  }

  useEffect(() => getData(), []);

  return (
    <ChartScreen type='quizzes' chartDatas={chartDatas} initialIndex={0} />
  );
};

export default Quizzes;
