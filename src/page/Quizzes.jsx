import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbRoomByCode } from '../models/roomModel';
import { getDbQuizAnswers } from '../models/quizAnswerModel';
import { MINI_GAME_MAP } from '../models/miniGameMap';
import { ChoicesScreen } from '../components/ChoicesScreen/ChoicesScreen';

const Quizzes = () => {
  let { roomCode, reflectionId } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const miniGameQuestions = MINI_GAME_MAP.find(
    (game) => game.game_id === reflectionId
  ).questions;
  const [miniGameResults, setMiniGameResults] = useState(miniGameQuestions);

  // Returns the count of answers as an object, indexed by questionId then answerId
  function getAnswerCounts(answers) {
    const answerCounts = {};
    for (const answer of answers) {
      const { questionId, answerId } = answer;
      if (answerCounts[questionId] === undefined) {
        answerCounts[questionId] = {};
      }
      if (answerCounts[questionId][answerId] === undefined) {
        answerCounts[questionId][answerId] = 1;
      } else {
        answerCounts[questionId][answerId] += 1;
      }
    }
    return answerCounts;
  }

  // Returns a copy of the mini game questions, but with additional answer counts
  function getMiniGameResults(answerCounts) {
    const results = JSON.parse(JSON.stringify(miniGameQuestions));
    for (let result of results) {
      for (let answer of result.answers) {
        answer.count = 0;
      }
    }
    for (let questionId in answerCounts) {
      for (let answerId in answerCounts[questionId]) {
        questionId = parseInt(questionId);
        answerId = parseInt(answerId);
        const result = results.find((x) => x.question_id === questionId);
        const count = answerCounts[questionId][answerId];
        result.answers.find((answer) => answer.answer_id === answerId).count +=
          count;
      }
    }
    return results;
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
    const answers = dbQuizAnswers.flatMap((x) => x.answers);
    const answerCounts = getAnswerCounts(answers);
    const results = getMiniGameResults(answerCounts);
    setMiniGameResults(results);
  }

  useEffect(() => getData(), []);

  return (
    <ChoicesScreen type='quizzes' options={miniGameResults} initialIndex={0} />
  );
};

export default Quizzes;
