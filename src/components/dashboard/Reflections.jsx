import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';
import { getDbReflectionResponses } from '../../models/reflectionResponseModel';

const Reflections = () => {
  const { roomId, reflectionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [reflectionResponses, setReflectionResponses] = useState(null);

  async function getData() {
    const dbRoom = await getDbRoom(roomId);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/');  // redirect if the room does not exist, or facilitator is unauthorised to access it
    }

    const dbReflectionResponses = await getDbReflectionResponses(roomId, reflectionId, true);
    setReflectionResponses(dbReflectionResponses);
  }

  useEffect(() => getData(), []);

  return (
    <div>
      { reflectionResponses ? reflectionResponses.map(x => <p>{x.answer}</p>) : null }
    </div>
  );
};

export default Reflections;
