import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { deleteRoom, getRooms } from '../../models/roomModel';
import RoomCard from './RoomCard';

const Home = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState(null);

  async function handleDelete(id) {
    await deleteRoom(id);
    setRooms(rooms.filter(room => room.id !== id));
  }

  useEffect(() => {
    async function loadRooms() {
      const teacherId = currentUser.id;
      const rooms = await getRooms(teacherId);
      setRooms(rooms);
    }
    loadRooms();
  }, [currentUser]);

  return (
    <div>
      <h1>Rooms</h1>
      {
        rooms
          ? rooms.map(room => <RoomCard key={room.id} room={room} handleDelete={() => handleDelete(room.id)}/>)
          : null
      }
    </div>
  );
};

export default Home;
