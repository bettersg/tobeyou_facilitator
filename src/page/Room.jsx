import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbReflectionResponses } from '../models/reflectionResponseModel';
import { getDbRoomByCode } from '../models/roomModel';
import { REFLECTION_ID_MAP } from '../models/storyMap';
import { GeneralBreadcrumbs } from '../components/GeneralBreadcrumbs/GeneralBreadcrumbs';
import {
  FlexBoxSpaceBetween,
  FlexBoxCenter,
  FlexBoxAlign,
  FlexBoxAlignColumn,
} from '../components/styled/general';
import { GeneralButton } from '../components/GeneralButton/GeneralButton';
import { PeopleAltOutlined, EditOutlined, QrCode } from '@mui/icons-material';
import { CharacterAvatar } from '../components/CharacterAvatar/CharacterAvatar';
import { ChapterDetailsCard } from '../components/ChapterDetailsCard/ChapterDetailsCard';
import { GeneralProgressBar } from '../components/GeneralProgressBar/GeneralProgressBar';
import { RoomModal } from '../components/GeneralRoomModal/RoomModal';

const Room = () => {
  const { roomCode } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [completionRateNumerators, setCompletionRateNumerators] = useState({});
  const [completionRateDenominator, setCompletionRateDenominator] =
    useState(null);

  // for menu
  const [currentCharChapt, setCurrentCharChapt] = React.useState(null);
  const [currentReflectionId, setCurrentReflectionId] = React.useState(null);

  const [isGameChoicesModalOpen, setIsGameChoicesModalOpen] =
    React.useState(false);

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
    setCurrentCharChapt(REFLECTION_ID_MAP[room?.reflectionIds[0]]);
    setCurrentReflectionId(room?.reflectionIds[0]);
  }, [room]);

  useEffect(() => {
    getRoom();
  }, []);

  return (
    <Box
      sx={{
        height: 'calc(80% + 90px)',
        overflow: 'auto',
        paddingTop: '76px',
        paddingBottom: '25px',
      }}
    >
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
                  mb: '20px',
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
                          onClick={() => {
                            setIsGameChoicesModalOpen(!isGameChoicesModalOpen);
                            setCurrentReflectionId(reflectionId);
                          }}
                        >
                          <RoomModal
                            isModalOpen={isGameChoicesModalOpen}
                            setIsModalOpen={setIsGameChoicesModalOpen}
                            label='Game choices'
                            roomReflectionId={currentReflectionId}
                            roomCode={roomCode}
                            type='gameChoices'
                          />
                          <Typography variant='h4' sx={{ textAlign: 'center' }}>
                            Review Game Choices
                          </Typography>
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
                              `/room/${room.code}/reflectionId/${reflectionId}/quizzes`
                            )
                          }
                        >
                          <Typography
                            variant='h4'
                            sx={{ textAlign: 'center', cursor: 'pointer' }}
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
        </FlexBoxAlignColumn>
      ) : null}
    </Box>
  );
};

export default Room;
