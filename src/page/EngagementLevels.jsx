import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbRoom } from '../models/roomModel';
import { getDbEngagementLevels } from '../models/reflectionResponseModel';

const EngagementLevels = () => {
  let { roomId, reflectionId } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [averageEngagementLevel, setAverageEngagementLevel] = useState(null);

  async function getData() {
    const dbRoom = await getDbRoom(roomId);
    if (
      !dbRoom ||
      !dbRoom.facilitatorIds.includes(currentUser.id) ||
      !dbRoom.reflectionIds.includes(reflectionId)
    ) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    const roomCode = dbRoom.code;
    const dbEngagementLevels = await getDbEngagementLevels(
      roomCode,
      reflectionId
    );
    const engagementLevels = dbEngagementLevels.map(
      (engagementLevel) => engagementLevel.answer
    );
    const average =
      engagementLevels.reduce((a, b) => a + b, 0) / engagementLevels.length ||
      0;
    const roundedAverage = Math.round(average);
    setAverageEngagementLevel(roundedAverage);
  }

  useEffect(() => getData(), []);

  return (
    <div>
      <p>Average engagement level is {averageEngagementLevel}</p>
    </div>
  );
};

export default EngagementLevels;
