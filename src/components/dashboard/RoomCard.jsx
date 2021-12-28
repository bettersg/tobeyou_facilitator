import React from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, Typography } from '@mui/material';

const RoomCard = (props) => {
  const { room, handleDelete, toggleIsActive } = props;
  const navigate = useNavigate();
  const firstReflectionId = room.reflectionIds[0];
  return (
    <Card
      variant='outlined'
      style={{ borderRadius: 10, marginTop: 10, cursor: 'pointer' }}
      onClick={() => navigate(`/room/${room.id}/reflectionId/${firstReflectionId}`)}
    >
      <CardContent style={{ padding: 15 }}>
        <Typography>
          Room name: {room.name}
        </Typography>
        <Typography>
          Chapter: {room.chapterId}, reflection IDs: {JSON.stringify(room.reflectionIds)}
        </Typography>
        <Typography>
          Code: {room.code}
        </Typography>
        <Typography>
          Status: {room.isActive ? 'active' : 'archived' }
        </Typography>
        <Typography>
          <span style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); toggleIsActive() }}>Toggle</span>
        </Typography>
        <Typography>
          <span style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDelete() }}>Delete</span>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RoomCard;
