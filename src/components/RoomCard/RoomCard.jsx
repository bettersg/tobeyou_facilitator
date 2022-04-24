import React from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router';
import {
  EditOutlined,
  QrCode,
  FileDownloadOutlined,
} from '@mui/icons-material';
import { Card, Grid, Typography } from '@mui/material';
import { FlexBoxSpaceBetween, FlexBoxCenter } from '../styled/general';
import { StyledRoomCardTag } from '../RoomCardTag/StyledRoomCardTag';
import { CharacterAvatarGroup } from '../CharacterAvatarGroup/CharacterAvatarGroup';

const RoomCard = (props) => {
  const { room, handleSoftDelete, handleQrModal, handleEdit, toggleIsActive } =
    props;
  const navigate = useNavigate();

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
      onClick={() => navigate(`/room/${room.id}`)}
    >
      <Grid container sx={{ padding: '36px 40px', height: '100%' }} spacing={1}>
        <FlexBoxSpaceBetween sx={{ width: '100%', height: '28px' }}>
          <StyledRoomCardTag
            label={'TODO: upcoming/archived'}
            variant='outlined'
            size='small'
          />
          <FlexBoxCenter>
            <EditOutlined
              sx={{
                color: (theme) => theme.palette.lapis[100],
                marginLeft: '4px',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            />
            <QrCode
              sx={{
                color: (theme) => theme.palette.lapis[100],
                marginLeft: '4px',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleQrModal();
              }}
            />
            <FileDownloadOutlined
              sx={{
                color: (theme) => theme.palette.lapis[100],
                marginLeft: '4px',
              }}
            />
          </FlexBoxCenter>
        </FlexBoxSpaceBetween>
        <Grid item xs={12}>
          <Typography
            variant='h6'
            sx={{ textTransform: 'uppercase', opacity: 0.5, fontSize: 14 }}
          >
            {dateString}
          </Typography>
        </Grid>
        <Grid
          item
          xs={7}
          sx={{ paddingRight: '8px', height: '100%' }}
          direction='column'
          display='flex'
          justifyContent='space-between'
        >
          <Grid item>
            <Typography variant='h4' sx={{ mb: '8px' }}>
              {room.name}
            </Typography>
            <Typography>Class Code: {room.code}</Typography>
          </Grid>
          <Grid>
            <Typography
              variant='body2'
              sx={{ textTransform: 'uppercase', marginBottom: '52px' }}
            >
              {room.organisation}
            </Typography>
          </Grid>
        </Grid>

        {/* right side */}
        <Grid item xs={5}>
          <CharacterAvatarGroup data={room.reflectionIds} />
          {/* {room.reflectionIds.map((reflectionId) => {
              const { character, chapter } = REFLECTION_ID_MAP[reflectionId];
              return (
                <Typography key={reflectionId}>
                  {character} {chapter}
                </Typography>
              );
            })} */}
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
                handleSoftDelete();
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
