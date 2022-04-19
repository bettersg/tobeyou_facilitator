import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbRoom } from '../models/roomModel';
import { getDbUser } from '../models/userModel';
import REFLECTION_ID_MAP from '../models/reflectionIdMap';

const GameChoices = () => {
  let { roomId, reflectionId } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function getData() {
    const dbRoom = await getDbRoom(roomId);
    if (
      !dbRoom ||
      !dbRoom.facilitatorIds.includes(currentUser.id) ||
      !dbRoom.reflectionIds.includes(reflectionId)
    ) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    // TODO
  }

  useEffect(() => getData(), []);

  return (
    <div>
      <p>TODO: Game Choices</p>
    </div>
  );
};

export default GameChoices;
