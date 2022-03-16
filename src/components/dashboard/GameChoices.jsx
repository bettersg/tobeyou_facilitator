import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';

const GameChoices = () => {
  let { roomId, reflectionId, choiceName } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  async function getData() {
    const dbRoom = await getDbRoom(roomId);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    // TODO: get game choices data
  }

  useEffect(() => getData(), []);

  return (
    <div>
      <Typography>Game Choices: {choiceName}</Typography>
      <Typography>TODO: get choices and their data</Typography>
    </div>
  );
};

export default GameChoices;
