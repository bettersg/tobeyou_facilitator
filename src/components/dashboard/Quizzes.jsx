import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';
import { getDbQuizAnswers } from '../../models/quizAnswerModel';

const Quizzes = () => {
  const { roomId, reflectionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [quizAnswers, setQuizAnswers] = useState(null);

  async function getData() {
    const dbRoom = await getDbRoom(roomId);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/');  // redirect if the room does not exist, or facilitator is unauthorised to access it
    }

    const dbQuizAnswers = await getDbQuizAnswers(roomId, reflectionId);  // reflectionId serves as the gameId
    setQuizAnswers(dbQuizAnswers);
  }

  useEffect(() => getData(), []);

  return (
    <div>
      { quizAnswers ? quizAnswers.map(x => <p>{ JSON.stringify(x.answers) }</p>) : null }
    </div>
  );
};

export default Quizzes;
