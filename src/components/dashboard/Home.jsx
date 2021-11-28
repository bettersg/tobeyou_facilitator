import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { useAuth } from '../../contexts/AuthContext';
import { deleteDbRoom, getDbRooms } from '../../models/roomModel';
import RoomCard from './RoomCard';

const Home = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState(null);

  async function handleDelete(id) {
    await deleteDbRoom(id);
    setRooms(rooms.filter(room => room.id !== id));
  }

  useEffect(() => {
    async function loadRooms() {
      const facilitatorId = currentUser.id;
      const rooms = await getDbRooms(facilitatorId);
      setRooms(rooms);
    }
    loadRooms();
  }, [currentUser]);

  return (
    <Box>
      {
        rooms === null
          ? ''  // TODO: placeholder
          : rooms.length === 0
            ? 'You have no rooms'  // TODO: placeholder
            : rooms.map(room => <RoomCard key={room.id} room={room} handleDelete={() => handleDelete(room.id)} />)
      }
    </Box>
  );
};

export default Home;
