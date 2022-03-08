import React from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { Card, CardContent, Typography } from '@mui/material';
import { REFLECTION_ID_MAP } from '../../models/storyMap';

const RoomCard = (props) => {
  const { room, handleDelete, toggleIsActive } = props;
  const navigate = useNavigate();
  const firstReflectionId = room.reflectionIds[0];

  const isUpcoming = moment(room.date) - moment() > 0;
  const dateString = moment(room.date).format('DD MMM YYYY');

  return (
    <Card
      variant='outlined'
      style={{ borderRadius: 10, marginTop: 10, cursor: 'pointer' }}
      onClick={() =>
        navigate(`/room/${room.id}/reflectionId/${firstReflectionId}`)
      }
    >
      <CardContent
        style={{
          padding: 15,
          backgroundColor: room.isActive ? 'white' : 'lightgrey',
        }}
      >
        <Typography variant='h6'>{room.organisation}</Typography>
        <Typography variant='h4'>{room.name}</Typography>
        <Typography>
          {dateString} {isUpcoming ? '(Upcoming)' : null}
        </Typography>
        <Typography>Class Code: {room.code}</Typography>
        {room.reflectionIds.map((reflectionId) => {
          const { character, chapter } = REFLECTION_ID_MAP[reflectionId];
          return (
            <Typography key={reflectionId}>
              {character} {chapter}
            </Typography>
          );
        })}
        <Typography>
          <span
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              toggleIsActive();
            }}
          >
            Toggle
          </span>
        </Typography>
        <Typography>
          <span
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
