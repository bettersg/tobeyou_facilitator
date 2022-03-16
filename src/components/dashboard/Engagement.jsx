import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';

const Engagement = () => {
  let { roomId, reflectionId } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [engagement, getEngagement] = useState(null);

  async function getData() {
    const dbRoom = await getDbRoom(roomId);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    // TODO: get engagement data
  }

  useEffect(() => getData(), []);

  return (
    <div>
      <Typography>
        How would you rate your level of engagement with the story?
      </Typography>
      <Typography>TODO: get engagement level</Typography>
    </div>
  );
};

export default Engagement;
