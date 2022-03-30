import React from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { EditOutlined , QrCode, FileDownloadOutlined } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { FlexBoxSpaceBetween, FlexBoxCenter, FlexBoxCenterColumn } from '../styled/general';
import { REFLECTION_ID_MAP } from '../../models/storyMap';
import { StyledRoomCardTag } from '../components/RoomCardTag/StyledRoomCardTag';
import { palette } from '@mui/system';

const RoomCard = (props) => {
  const { room, handleDelete, toggleIsActive } = props;
  const navigate = useNavigate();
  const firstReflectionId = room.reflectionIds[0];

  const isUpcoming = moment(room.date) - moment() > 0;
  const dateString = moment(room.date).format('DD MMM YYYY');

  return (
    <Card
      variant='outlined'
      sx={{
        borderRadius: 4,
        height: '100%',
        cursor: 'pointer',
      }}
      onClick={() =>
        navigate(`/room/${room.id}/reflectionId/${firstReflectionId}`)
      }
    >
        

        <Grid container sx={{padding: "36px 40px", height: "100%" }} spacing={1}>
          <FlexBoxSpaceBetween sx={{width: "100%", mb: "8px", height: "28px"}}>
            <StyledRoomCardTag
              label={'TODO: upcoming/archived'}
              variant='outlined'
              size='small'
            />
            <FlexBoxCenter>
              <EditOutlined sx={{color: (theme) => theme.palette.lapis[100], marginLeft: "4px"}}/>
              <QrCode sx={{color: (theme) => theme.palette.lapis[100], marginLeft: "4px"}}/>
              <FileDownloadOutlined sx={{color: (theme) => theme.palette.lapis[100], marginLeft: "4px"}}/>
            </FlexBoxCenter>
          </FlexBoxSpaceBetween>
          <Grid item xs={7} sx={{paddingRight: "8px", height: "100%"}} direction="column" display="flex" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5" sx={{ textTransform: 'uppercase', fontSize: "18px", opacity: 0.5, mb: "8px" }}>
                  {dateString}
                </Typography>
                <Typography variant='h3' sx={{ mb: "8px"}}>{room.name}</Typography>
                <Typography>Class Code: {room.code}</Typography>

              </Grid>
              <Grid>
                <Typography variant='body2' sx={{ textTransform: 'uppercase', marginBottom: "36px" }}>
                  {room.organisation}
                </Typography>
              </Grid>
          </Grid>
          <Grid item xs={5}>
           
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
    </Card>
  );
};

export default RoomCard;
