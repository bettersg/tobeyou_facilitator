import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbGameChoicesChartDatas } from '../models/savedStateModel';
import { getDbRoomByCode } from '../models/roomModel';
import ChartScreen from '../components/ChartScreen/ChartScreen';

const GameChoices = () => {
  let { roomCode, reflectionId, choiceIdx } = useParams();
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
    const chartDatas = await getDbGameChoicesChartDatas(
      reflectionId,
      dbRoom.participantIds
    );
    setChartDatas(chartDatas);
  }

  useEffect(() => getData(), []);

  return (
    <ChartScreen
      type='gameChoices'
      chartDatas={chartDatas}
      initialIndex={choiceIdx}
    />
  );
};

export default GameChoices;
