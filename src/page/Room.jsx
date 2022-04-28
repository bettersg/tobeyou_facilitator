import React, { useEffect, useState } from 'react';
import { Edit, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbReflectionResponses } from '../models/reflectionResponseModel';
import { getDbRoomByCode } from '../models/roomModel';
import { REFLECTION_ID_MAP } from '../models/storyMap';

const Room = () => {
  let { roomCode } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [completionRateNumerators, setCompletionRateNumerators] = useState({});
  const [completionRateDenominator, setCompletionRateDenominator] =
    useState(null);

  async function getRoom() {
    const dbRoom = await getDbRoomByCode(roomCode);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    setRoom(dbRoom);

    // Get completion rate statistics (numerator and denominator)
    const allReflectionResponses = await getDbReflectionResponses(
      roomCode,
      null,
      true
    );
    const numerators = {};
    for (const reflectionId of dbRoom.reflectionIds) {
      const reflectionResponses = allReflectionResponses.filter(
        (rr) => rr.reflectionId === reflectionId
      );
      const userIdsWithReflection = reflectionResponses.map((rr) => rr.userId);
      const userIdsInRoomWithReflection = userIdsWithReflection.filter(
        (userId) => dbRoom.participantIds.includes(userId)
      );
      const numUniqueUserIdsInRoomWithReflection = [
        ...new Set(userIdsInRoomWithReflection),
      ].length;
      numerators[reflectionId] = numUniqueUserIdsInRoomWithReflection;
    }
    setCompletionRateNumerators(numerators);
    const denominator = dbRoom.participantIds.length;
    setCompletionRateDenominator(denominator);
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
            <Typography>
              {completionRateNumerators[reflectionId]}/
              {completionRateDenominator} students completed
            </Typography>
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/room/${room.code}/reflectionId/${reflectionId}/reflections`
                )
              }
            >
              View Reflections
            </Typography>
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/room/${room.code}/reflectionId/${reflectionId}/engagementLevels`
                )
              }
            >
              View Engagement Levels
            </Typography>
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/room/${room.code}/reflectionId/${reflectionId}/gameChoices`
                )
              }
            >
              Review Game Choices
            </Typography>
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() =>
                navigate(
                  `/room/${room.code}/reflectionId/${reflectionId}/quizzes`
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
