import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbRoomByCode } from '../models/roomModel';
import { getDbQuizAnswers } from '../models/quizAnswerModel';
import { MINI_GAME_MAP } from '../models/miniGameMap';
import { ChoicesScreen } from '../components/ChoicesScreen/ChoicesScreen';

const Quizzes = () => {
  let { roomCode, reflectionId, quizIdx } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [quizAnswers, setQuizAnswers] = useState(null);
  const miniGameQuestions = MINI_GAME_MAP.find(
    (game) => game.game_id === reflectionId
  ).questions;
  const [miniGameResults, setMiniGameResults] = useState(miniGameQuestions);
  const [currentMinigameIndex, setCurrentMinigameIndex] = useState(quizIdx);

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

  const compileResults = useCallback(() => {
    if (quizAnswers === null) return;
    const answers = quizAnswers.map((x) => x.answers).flat();
    const answerCounts = getAnswerCounts(answers);
    const results = getMiniGameResults(answerCounts);
    setMiniGameResults(results);
  }, [quizAnswers]);

  function buildResultCard(question) {
    return (
      <div>
        <p>{question.question}</p>
        <ul>
          {question.answers.map((answer, idx) => (
            <li key={idx}>
              {answer.title} [count = {answer.count}]{' '}
              {answer.answer_id === question.correct_answer_id
                ? '[correct]'
                : null}
            </li>
          ))}
        </ul>
      </div>
    );
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
    setQuizAnswers(dbQuizAnswers);
  }

  useEffect(() => getData(), []);
  useEffect(() => compileResults(), [quizAnswers]);
  // {miniGameResults ? miniGameResults.map(buildResultCard) : null}
  console.log(miniGameResults[currentMinigameIndex].explanation);

  const handleLeft = () => {
    setCurrentMinigameIndex(Math.max(0, currentMinigameIndex - 1));
  };

  const handleRight = () => {
    setCurrentMinigameIndex(
      Math.min(miniGameResults.length - 1, currentMinigameIndex + 1)
    );
  };

  const handleKeyDown = (event) => {
    console.log(event);
    if (event.keyCode === 37) {
      handleLeft();
    } else if (event.keyCode === 39) {
      handleRight();
    }
  };
  return (
    <ChoicesScreen
      title={miniGameResults[currentMinigameIndex].question}
      type='quizzes'
      onKeyDown={handleKeyDown}
      onLeft={handleLeft}
      onRight={handleRight}
      gameChoiceValues={miniGameResults[currentMinigameIndex].answers}
      tooltipTitle={miniGameResults[currentMinigameIndex].explanation}
    ></ChoicesScreen>
  );
};

export default Quizzes;
