import React from 'react';

const RoomCard = ({ room, handleDelete }) => {
  return (
    <div>
      <pre key={room.id}>{JSON.stringify(room, null, 2)}</pre>
      <p style={{ cursor: 'pointer' }} onClick={handleDelete}>Delete</p>
    </div>
  );
}

export default RoomCard;
