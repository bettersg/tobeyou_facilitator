import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
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
  FlexBoxCenterColumn,
  FlexBoxAlign,
  FlexBoxAlignColumn,
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
import { ChapterDetailsCard } from '../components/ChapterDetailsCard/ChapterDetailsCard';
import { GeneralProgressBar } from '../components/GeneralProgressBar/GeneralProgressBar';

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
    <Box sx={{ height: '100%', overflow: 'auto', paddingTop: '76px' }}>
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
                ]}
              />
            ) : null}
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
            <GeneralButton sx={{ ml: 1 }}>Download report</GeneralButton>
          </FlexBoxCenter>
        </FlexBoxSpaceBetween>
      </Paper>

      {currentCharChapt && currentReflectionId ? (
        <FlexBoxAlignColumn
          sx={{
            height: '100%',
            overflow: 'auto',
            background: (theme) => theme.palette.lapis[10],
          }}
        >
          <Box sx={{ width: 'calc(80% + 64px)', padding: '24px 0' }}>
            <Typography variant='h3' sx={{ textAlign: 'left' }}>
              Class Code: {room?.code}
            </Typography>
          </Box>

          {room?.reflectionIds.map((reflectionId) => {
            const { character, chapterId } = REFLECTION_ID_MAP[reflectionId];
            return (
              <Paper
                key={reflectionId}
                sx={{
                  top: 210,
                  padding: '32px',
                  background: 'white',
                  width: '80%',
                  borderRadius: '30px',
                  mb: '48px',
                }}
              >
                <Grid container sx={{ display: 'flex', height: '100%' }}>
                  <Grid xs={12} sx={{ paddingBottom: '24px' }}>
                    <FlexBoxAlign>
                      <CharacterAvatar avatarContent={character} />
                      <Typography sx={{ ml: 2, fontWeight: 700 }} variant='h4'>
                        {character} / Chapter {chapterId}
                      </Typography>
                    </FlexBoxAlign>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    sx={{ gridAutoRows: '1fr', alignItems: 'stretch' }}
                  >
                    <Grid item xs={4}>
                      <ChapterDetailsCard
                        sx={{
                          // backgroundColor: (theme) => theme.palette.midnight[100],
                          background:
                            'linear-gradient(180deg, #19A3AD 0%, #3DCAD3 100%)',
                        }}
                      >
                        <GeneralProgressBar
                          totalStudents={completionRateDenominator}
                          completedStudents={
                            completionRateNumerators[reflectionId]
                          }
                        />
                        <Typography variant='h4' sx={{ fontWeight: 500 }}>
                          {completionRateNumerators[reflectionId]}/
                          {completionRateDenominator} students completed
                        </Typography>
                      </ChapterDetailsCard>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid container item xs={7} spacing={2}>
                      <Grid item xs={6}>
                        <ChapterDetailsCard
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.lapis.dark2,
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            navigate(
                              `/room/${room.code}/reflectionId/${reflectionId}/reflections`
                            )
                          }
                        >
                          <Typography variant='h4'>View Reflections</Typography>
                        </ChapterDetailsCard>
                      </Grid>
                      <Grid item xs={3}>
                        <ChapterDetailsCard
                          sx={{
                            backgroundColor: (theme) => theme.palette.aqua[1],
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            navigate(
                              `/room/${room.code}/reflectionId/${reflectionId}/gameChoices`
                            )
                          }
                        >
                          <Typography variant='h4' sx={{ textAlign: 'center' }}>
                            Review Game Choices
                          </Typography>
                        </ChapterDetailsCard>
                      </Grid>
                      <Grid item xs={3}>
                        <ChapterDetailsCard
                          sx={{
                            backgroundColor: (theme) => theme.palette.aqua[1],
                          }}
                        >
                          <Typography
                            variant='h4'
                            sx={{ textAlign: 'center', cursor: 'pointer' }}
                            onClick={() =>
                              navigate(
                                `/room/${room.code}/reflectionId/${reflectionId}/quizzes`
                              )
                            }
                          >
                            Review Mini Game
                          </Typography>
                        </ChapterDetailsCard>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container xs={3} spacing={2}>
                    <Grid item xs={12}></Grid>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}

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
        </FlexBoxAlignColumn>
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
