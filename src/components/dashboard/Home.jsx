import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useAuth } from '../../contexts/AuthContext';
import { deleteDbRoom, getDbRooms } from '../../models/roomModel';
import RoomCard from './RoomCard';
import NewRoomModal from './NewRoomModal';

const Home = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState(null);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);

  async function handleDeleteRoom(id) {
    await deleteDbRoom(id);
    setRooms(rooms.filter(room => room.id !== id));
  }

  const loadRooms = useCallback(
    async () => {
      const facilitatorId = currentUser.id;
      const rooms = await getDbRooms(facilitatorId);
      setRooms(rooms);
    },
    [currentUser]
  );

  useEffect(loadRooms, [loadRooms]);

  return (
    <Box>
      <Box>
        <Button
          variant='contained'
          color='primary'
          onClick={() => setIsNewRoomModalOpen(true)}
          style={{ marginTop: 10 }}
        >
          <Add/>
          Add New Class
        </Button>
      </Box>
      <Box>
        {
          rooms === null
            ? ''  // TODO: placeholder
            : rooms.length === 0
              ? 'You have no rooms'  // TODO: placeholder
              : rooms.map(room => <RoomCard key={room.id} room={room} handleDelete={() => handleDeleteRoom(room.id)} />)
        }
      </Box>
      <NewRoomModal
        isNewRoomModalOpen={isNewRoomModalOpen}
        setIsNewRoomModalOpen={setIsNewRoomModalOpen}
        loadRooms={loadRooms}
      />
    </Box>
  );
};

export default Home;
