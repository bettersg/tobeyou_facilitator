import React, { useEffect, useState } from 'react';
import { Edit, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbRoom } from '../models/roomModel';
import { REFLECTION_ID_MAP } from '../models/storyMap';

const Room = () => {
  let { roomId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);

  async function getRoom() {
    const dbRoom = await getDbRoom(roomId);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    setRoom(dbRoom);
  }

  useEffect(() => getRoom(), []);

  return (
    <div>
      <h4>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Your Classes
        </span>
        <KeyboardArrowRight />
        {room?.name}
        <Edit />
      </h4>
      <h3>Class Code: {room?.code}</h3>
      {room?.reflectionIds.map((reflectionId) => {
        const { character, chapter } = REFLECTION_ID_MAP[reflectionId];
        return (
          <Box key={reflectionId}>
            <Typography>
              {character} / Chapter {chapter}
            </Typography>
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/room/${room.id}/reflectionId/${reflectionId}/completionRate`
                )
              }
            >
              [TODO] X/Y students completed
            </Typography>
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/room/${room.id}/reflectionId/${reflectionId}/reflections`
                )
              }
            >
              View Reflections
            </Typography>
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/room/${room.id}/reflectionId/${reflectionId}/gameChoices`
                )
              }
            >
              Review Game Choices
            </Typography>
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/room/${room.id}/reflectionId/${reflectionId}/quizzes`
                )
              }
            >
              Review Mini Game
            </Typography>
            <br />
          </Box>
        );
      })}
    </div>
  );
};

export default Room;
