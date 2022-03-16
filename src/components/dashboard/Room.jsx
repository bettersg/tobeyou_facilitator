import React, { useEffect, useState } from 'react';
import {
  Edit,
  KeyboardArrowDown,
  KeyboardArrowRight,
  People,
  QrCode,
} from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';
import { getDbUser } from '../../models/userModel';
import { REFLECTION_ID_MAP } from '../../models/storyMap';
import { GLOBAL_VAR_MAP } from '../../models/globalVarMap';

const Room = () => {
  let { roomId, reflectionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [participantsCount, setParticipantsCount] = useState(null);
  const [completedParticipantsCount, setCompletedParticipantsCount] =
    useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  reflectionId = parseInt(reflectionId);
  const { character, chapter } = REFLECTION_ID_MAP[reflectionId];

  async function getRoom() {
    const dbRoom = await getDbRoom(roomId);
    if (
      !dbRoom ||
      !dbRoom.facilitatorIds.includes(currentUser.id) ||
      !dbRoom.reflectionIds.includes(reflectionId)
    ) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    setRoom(dbRoom);
  }

  async function getCompletionInfo() {
    function hasParticipantCompleted(participant) {
      const { characterId, chapterId } = REFLECTION_ID_MAP[reflectionId];
      const participantAchievement = participant.achievements?.find(
        (achievement) =>
          achievement.chapter === chapterId &&
          achievement.character === characterId
      );
      return !!participantAchievement;
    }

    if (!room) return;
    const participants = await Promise.all(
      room.participantIds.map((participantId) => getDbUser(participantId))
    );
    const completedParticipants = participants.filter(hasParticipantCompleted);
    setParticipantsCount(participants.length);
    setCompletedParticipantsCount(completedParticipants.length);
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleMenuItemClick(newReflectionId) {
    handleClose();
    navigate(`/room/${roomId}/reflectionId/${newReflectionId}`);
  }

  useEffect(() => getRoom(), []);
  useEffect(() => getCompletionInfo(), [room]);

  function ClassCode() {
    return (
      <Card variant='outlined' style={{ borderRadius: 10, marginTop: 10 }}>
        <CardContent>
          <Typography>Class code: {room ? room.code : null}</Typography>
          <Typography>
            {completedParticipantsCount}/{participantsCount} students completed
          </Typography>
          <Button onClick={() => alert('TODO: display QR code')}>
            <QrCode />
            Show QR code
          </Button>
        </CardContent>
      </Card>
    );
  }

  // TODO: I don't know what to call this, sorry!
  function LeftCard({ title, subtitle, url }) {
    return (
      <Card
        variant='outlined'
        style={{ borderRadius: 10, marginTop: 10, cursor: 'pointer' }}
        onClick={() => navigate(url)}
      >
        <CardContent style={{ padding: 15 }}>
          <Typography variant='h5'>{title}</Typography>
          {subtitle ? <Typography variant='h6'>{subtitle}</Typography> : null}
        </CardContent>
      </Card>
    );
  }

  function GameChoicesTable() {
    const chapter = GLOBAL_VAR_MAP.flatMap(
      (character) => character.chapters
    ).find((chapter) => reflectionId === parseInt(chapter.reflectionId));
    const choices = chapter.variables ?? [];
    const rows = choices.map((variable) => ({
      character: character,
      choiceName: variable.name,
      description: variable.description,
    }));
    return (
      <Card variant='outlined' style={{ borderRadius: 10, marginTop: 10 }}>
        <Typography variant='h4'>Game choices</Typography>
        <TableContainer>
          <Table aria-label='game choices table'>
            <TableHead>
              <TableRow>
                <TableCell>Character</TableCell>
                <TableCell>Name of choice</TableCell>
                <TableCell>Description</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow
                    key={row.choiceName}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      navigate(
                        `/room/${roomId}/reflectionId/${reflectionId}/choices/${row.choiceName}`
                      )
                    }
                  >
                    <TableCell>{row.character}</TableCell>
                    <TableCell>{row.choiceName}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <KeyboardArrowRight />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
  }

  return (
    <div>
      <h3>
        <p
          style={{ display: 'inline', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Your Classes
        </p>
        <KeyboardArrowRight />
        {room ? room.name : null}
        <KeyboardArrowRight />
        {character} / Chapter {chapter}{' '}
        <Button onClick={handleClick}>
          <KeyboardArrowDown />
        </Button>
        <People />
        <Edit />
        <QrCode />
      </h3>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {room
          ? Object.keys(REFLECTION_ID_MAP)
              .filter((reflectionId) =>
                room.reflectionIds.includes(parseInt(reflectionId))
              )
              .map((reflectionId) => {
                const { character, chapter } = REFLECTION_ID_MAP[reflectionId];
                return (
                  <MenuItem
                    key={reflectionId}
                    onClick={() => handleMenuItemClick(reflectionId)}
                  >
                    {character} / Chapter {chapter}
                  </MenuItem>
                );
              })
          : null}
      </Menu>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ClassCode />
          <LeftCard
            title={'Minigame results'}
            subtitle={'<X> questions'}
            url={`/room/${roomId}/reflectionId/${reflectionId}/quizzes`}
          />
          <LeftCard
            title={'Reflections'}
            subtitle={'<X> reflections available'}
            url={`/room/${roomId}/reflectionId/${reflectionId}/reflections`}
          />
          <LeftCard
            title={'Engagement result'}
            url={`/room/${roomId}/reflectionId/${reflectionId}/engagement`}
          />
        </Grid>
        <Grid item xs={8}>
          <GameChoicesTable />
        </Grid>
      </Grid>
    </div>
  );
};

export default Room;
