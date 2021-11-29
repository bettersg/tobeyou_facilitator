import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

const RoomCard = ({ room, handleDelete }) => {
  return (
    <Card variant='outlined' style={{ borderRadius: 10, marginTop: 10 }}>
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
          <span style={{ cursor: 'pointer' }} onClick={handleDelete}>Delete</span>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RoomCard;
