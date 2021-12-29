import React from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { Card, CardContent, Typography } from '@mui/material';

const RoomCard = (props) => {
  const { room, handleDelete, toggleIsActive } = props;
  const navigate = useNavigate();
  const firstReflectionId = room.reflectionIds[0];

  const isUpcoming = moment(room.date) - moment() > 0;
  const dateString = moment(room.date).format('DD MMM YYYY');

  // TODO: refactor, should be in common place with characterChapterMap
  const reflectionIdMap = {
    1: { characterName: 'Aman', chapter: 1 },
    2: { characterName: 'Nadia', chapter: 1 },
    3: { characterName: 'Nadia', chapter: 2 },
    4: { characterName: 'Nadia', chapter: 3 },
    5: { characterName: 'Aman', chapter: 2 },
    6: { characterName: 'Aman', chapter: 3 },
  }

  return (
    <Card
      variant='outlined'
      style={{ borderRadius: 10, marginTop: 10, cursor: 'pointer' }}
      onClick={() => navigate(`/room/${room.id}/reflectionId/${firstReflectionId}`)}
    >
      <CardContent style={{ padding: 15, backgroundColor: room.isActive ? 'white' : 'lightgrey' }}>
        <Typography variant="h6">{room.organisation}</Typography>
        <Typography variant="h4">{room.name}</Typography>
        <Typography>{dateString} {isUpcoming ? '(Upcoming)' : null}</Typography>
        <Typography>Class Code: {room.code}</Typography>
        {
          room.reflectionIds.map(reflectionId => {
            const { characterName, chapter } = reflectionIdMap[reflectionId];
            return <Typography>{characterName} {chapter}</Typography>
          })
        }
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
