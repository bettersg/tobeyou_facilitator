import React from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, Typography } from '@material-ui/core';

const RoomCard = ({ room, handleDelete }) => {
  const navigate = useNavigate();
  return (
    <Card
      variant='outlined'
      style={{ borderRadius: 10, marginTop: 10, cursor: 'pointer' }}
      onClick={() => navigate(`/room/${room.id}`)}
    >
      <CardContent style={{ padding: 15 }}>
        <Typography>
          Room name: {room.name}
        </Typography>
        <Typography>
          Chapter: {room.chapterId}
        </Typography>
        <Typography>
          Code: {room.code}
        </Typography>
        <Typography>
          Instructions: {room.instructions}
        </Typography>
        <Typography>
          <span style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDelete() }}>Delete</span>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RoomCard;
