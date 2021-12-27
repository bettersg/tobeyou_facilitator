import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';

const Room = () => {
  const { roomId, reflectionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);

  const getRoom = useCallback(
    async () => {
      const dbRoom = await getDbRoom(roomId);
      if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
        navigate('/');  // redirect if the room does not exist, or facilitator is unauthorised to access it
      }
      setRoom(dbRoom);
    },
    [roomId, currentUser, navigate]
  );

  useEffect(getRoom, []);

  return (
    <div>
      <h3>{room ? room.name : null}</h3>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate(`/room/${roomId}/reflectionId/${reflectionId}/completionRate`)}>Completion Rate</p>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate(`/room/${roomId}/reflectionId/${reflectionId}/reflections`)}>Reflections</p>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate(`/room/${roomId}/reflectionId/${reflectionId}/quizzes`)}>Mini Game</p>
    </div>
  );
};

export default Room;