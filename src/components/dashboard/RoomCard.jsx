import React from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { Edit, QrCode, Download } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
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
      style={{
        borderRadius: 10,
        marginTop: 10,
        height: '100%',
        cursor: 'pointer',
      }}
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
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Chip
              label={'TODO: upcoming/archived'}
              variant='outlined'
              size='small'
              style={{ textTransform: 'uppercase' }}
            />
            <Typography variant='h6' style={{ textTransform: 'uppercase' }}>
              {dateString}
            </Typography>
            <Typography variant='h4'>{room.name}</Typography>
            <Typography variant='h6'>Class Code: {room.code}</Typography>
            <Typography variant='h6' style={{ textTransform: 'uppercase' }}>
              {room.organisation}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Box>
              <Edit />
              <QrCode />
              <Download />
            </Box>
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
