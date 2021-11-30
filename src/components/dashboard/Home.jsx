import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Add } from '@material-ui/icons';
import { useAuth } from '../../contexts/AuthContext';
import { deleteDbRoom, getDbRooms, updateDbRoom } from '../../models/roomModel';
import RoomCard from './RoomCard';
import NewRoomModal from './NewRoomModal';

const Home = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState(null);
  const [filters, setFilters] = useState(() => ['all']);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);

  async function handleDeleteRoom(id) {
    await deleteDbRoom(id);
    setRooms(rooms.filter(room => room.id !== id));
  }

  async function toggleIsActiveRoom(id) {
    const room = rooms.find(x => x.id === id);
    const restRooms = rooms.filter(x => x.id !== id);
    room.isActive = !room.isActive;
    const newRooms = [...restRooms, room];
    await updateDbRoom(room);
    setRooms(newRooms);
  }

  function handleFilters(event, newFilters) {
    setFilters(newFilters);
  }

  const loadRooms = useCallback(
    async () => {
      const facilitatorId = currentUser.id;
      const rooms = await getDbRooms(facilitatorId);
      setRooms(rooms);
    },
    [currentUser]
  );

  useEffect(loadRooms, []);

  const Rooms = () => {
    if (rooms === null) {
      return '';
    } else if (rooms.length === 0) {
      return 'You have no rooms';  // TODO: placeholder
    } else {
      return rooms
        .filter(room => {
          if (filters === 'active') {
            return room.isActive;
          } else if (filters === 'archived') {
            return !room.isActive;
          }
          return true;
        })
        .map(room =>
          <RoomCard
            key={room.id}
            room={room}
            toggleIsActive={() => toggleIsActiveRoom(room.id)}
            handleDelete={() => handleDeleteRoom(room.id)}
          />);
    }
  }

  return (
    <Box>
      <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ToggleButtonGroup
          value={filters}
          exclusive
          onChange={handleFilters}
          aria-label='room filters'
        >
          <ToggleButton value='all' aria-label='all'>
            All
          </ToggleButton>
          <ToggleButton value='active' aria-label='active'>
            Active
          </ToggleButton>
          <ToggleButton value='archived' aria-label='archived'>
            Archived
          </ToggleButton>
        </ToggleButtonGroup>
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
        <Rooms/>
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
