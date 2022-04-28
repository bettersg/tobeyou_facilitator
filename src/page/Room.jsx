import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbReflectionResponses } from '../models/reflectionResponseModel';
import { getDbRoomByCode } from '../models/roomModel';
import { REFLECTION_ID_MAP } from '../models/storyMap';
import { GeneralBreadcrumbs } from '../components/GeneralBreadcrumbs/GeneralBreadcrumbs';
import {
  FlexBoxSpaceBetween,
  FlexBoxCenter,
  FlexBoxCenterColumnAlign,
} from '../components/styled/general';
import { GeneralButton } from '../components/GeneralButton/GeneralButton';
import {
  KeyboardArrowDown,
  PeopleAltOutlined,
  EditOutlined,
  Edit,
  KeyboardArrowRight,
  QrCode,
} from '@mui/icons-material';
import { CharacterAvatar } from '../components/CharacterAvatar/CharacterAvatar';

const Room = () => {
  let { roomCode } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [completionRateNumerators, setCompletionRateNumerators] = useState({});
  const [completionRateDenominator, setCompletionRateDenominator] =
    useState(null);

  // for menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentCharChapt, setCurrentCharChapt] = React.useState(null);
  const [currentReflectionId, setCurrentReflectionId] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function getRoom() {
    const dbRoom = await getDbRoomByCode(roomCode);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    setRoom(dbRoom);

    // Get completion rate statistics (numerator and denominator)
    const allReflectionResponses = await getDbReflectionResponses(
      roomCode,
      null,
      true
    );
    const numerators = {};
    for (const reflectionId of dbRoom.reflectionIds) {
      const reflectionResponses = allReflectionResponses.filter(
        (rr) => rr.reflectionId === reflectionId
      );
      const userIdsWithReflection = reflectionResponses.map((rr) => rr.userId);
      const userIdsInRoomWithReflection = userIdsWithReflection.filter(
        (userId) => dbRoom.participantIds.includes(userId)
      );
      const numUniqueUserIdsInRoomWithReflection = [
        ...new Set(userIdsInRoomWithReflection),
      ].length;
      numerators[reflectionId] = numUniqueUserIdsInRoomWithReflection;
    }
    setCompletionRateNumerators(numerators);
    const denominator = dbRoom.participantIds.length;
    setCompletionRateDenominator(denominator);
  }

  useEffect(() => {
    console.log('room', room);
    setCurrentCharChapt(REFLECTION_ID_MAP[room?.reflectionIds[0]]);
    setCurrentReflectionId(room?.reflectionIds[0]);
    console.log(room?.reflectionIds[0]);
    console.log(currentCharChapt);
  }, [room]);

  useEffect(() => {
    getRoom();
  }, []);

  console.log('room', room);
  console.log(currentCharChapt);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Paper
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 50,
          padding: '20px 68px',
        }}
      >
        <FlexBoxSpaceBetween>
          <FlexBoxCenter>
            {currentCharChapt ? (
              <GeneralBreadcrumbs
                breadcrumbItems={[
                  { label: 'Your Classes', link: '/' },
                  { label: room?.name },
                  {
                    label: (
                      <FlexBoxCenter>
                        <CharacterAvatar
                          avatarContent={currentCharChapt?.character}
                        />
                        <Typography
                          sx={{ ml: 2, fontWeight: 700 }}
                          variant='h4'
                        >
                          {currentCharChapt?.character} / Chapter{' '}
                          {currentCharChapt?.chapterId}
                        </Typography>
                      </FlexBoxCenter>
                    ),
                  },
                ]}
              />
            ) : null}
            <Box>
              <GeneralButton
                id='basic-button'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                customcolor='lapis10'
                sx={{ p: 1, minWidth: '52px', ml: 2 }}
                disableElevation
              >
                <KeyboardArrowDown />
              </GeneralButton>
              <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {room?.reflectionIds.map((reflectionId, idx) => {
                  // TODO: ensure reflectionIds are sorted by character ordering then chapter ID (in storyMap.js)
                  const { character, chapterId } =
                    REFLECTION_ID_MAP[reflectionId];

                  return (
                    <MenuItem
                      key={idx}
                      onClick={() => {
                        handleClose();
                        setCurrentCharChapt(REFLECTION_ID_MAP[reflectionId]);
                        setCurrentReflectionId(reflectionId);
                      }}
                    >
                      <CharacterAvatar avatarContent={character} />
                      <Typography sx={{ ml: 2, fontWeight: 700 }}>
                        {character} / Chapter {chapterId}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          </FlexBoxCenter>
          <FlexBoxCenter>
            <PeopleAltOutlined
              sx={{
                color: (theme) => theme.palette.lapis[100],
                marginRight: 1,
              }}
              fontSize='large'
            />
            <EditOutlined
              sx={{
                color: (theme) => theme.palette.lapis[100],
                marginRight: 1,
              }}
              fontSize='large'
            />
            <QrCode
              sx={{
                color: (theme) => theme.palette.lapis[100],
                marginRight: 1,
              }}
              fontSize='large'
            />
            <GeneralButton sx={{ml: 1}}>Download report</GeneralButton>
          </FlexBoxCenter>
        </FlexBoxSpaceBetween>
      </Paper>

      {currentCharChapt&&currentReflectionId ? (
        <FlexBoxCenterColumnAlign sx={{ height: '100%', overflow: 'auto', background: (theme) => theme.palette.lapis[10] }}>
          <Paper
            sx={{
              top: 210,
              padding: '68px',
              background: 'white',
              maxWidth: '80%',
            }}
          >
            <Box>
              <Typography>
                {currentCharChapt.character} / Chapter{' '}
                {currentCharChapt.chapter}
              </Typography>
              <Typography>
                {completionRateNumerators[currentReflectionId]}/
                {completionRateDenominator} students completed
              </Typography>
              <Typography
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(
                    `/room/${room.id}/reflectionId/${currentReflectionId}/reflections`
                  )
                }
              >
                View Reflections
              </Typography>
              <Typography
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(
                    `/room/${room.id}/reflectionId/${currentReflectionId}/gameChoices`
                  )
                }
              >
                Review Game Choices
              </Typography>
              <Typography
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(
                    `/room/${room.id}/reflectionId/${currentReflectionId}/quizzes`
                  )
                }
              >
                Review Mini Game
              </Typography>
              <br />
            </Box>
          </Paper>
        </FlexBoxCenterColumnAlign>
      ) : null}
{/* 
      <Box
        sx={{
          padding: '68px',
          paddingTop: '130px',
          background: (theme) => theme.palette.lapis[10],
          height: 'calc(100vh - 120px)',
        }}
      >
        <h3>Class Code: {room?.code}</h3>
        {room?.reflectionIds.map((reflectionId) => {
          const { character, chapterId } = REFLECTION_ID_MAP[reflectionId];
          return (
            <Box key={reflectionId}>
              <Typography>
                {character} / Chapter {chapterId}
              </Typography>
              <Typography>
                {completionRateNumerators[reflectionId]}/
                {completionRateDenominator} students completed
              </Typography>
              <Typography
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(
                    `/room/${room.id}/reflectionId/${reflectionId}/reflections`
                  )
                }
              >
                View Reflections
              </Typography>
              <Typography
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(
                    `/room/${room.id}/reflectionId/${reflectionId}/gameChoices`
                  )
                }
              >
                Review Game Choices
              </Typography>
              <Typography
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(
                    `/room/${room.id}/reflectionId/${reflectionId}/quizzes`
                  )
                }
              >
                Review Mini Game
              </Typography>
              <br />
            </Box>
          );
        })}
      </Box> */}
    </Box>
  );
};

export default Room;
