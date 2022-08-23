import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbRoomByCode } from '../models/roomModel';
import { getDbQuizAnswersChartDatas } from '../models/quizAnswerModel';
import ChartScreen from '../components/ChartScreen/ChartScreen';

const Quizzes = () => {
  let { roomCode, reflectionId } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [chartDatas, setChartDatas] = useState(null);

  async function getData() {
    const dbRoom = await getDbRoomByCode(roomCode);
    if (
      !dbRoom ||
      !dbRoom.facilitatorIds.includes(currentUser.id) ||
      !dbRoom.reflectionIds.includes(reflectionId)
    ) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    const chartDatas = await getDbQuizAnswersChartDatas(roomCode, reflectionId); // reflectionId serves as the gameId
    setChartDatas(chartDatas);
  }

  useEffect(() => getData(), []);

  return (
    <ChartScreen type='quizzes' chartDatas={chartDatas} initialIndex={0} />
  );
};

export default Quizzes;
