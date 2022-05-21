import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbReflectionResponses } from '../models/reflectionResponseModel';
import { getDbRoomByCode } from '../models/roomModel';
import { REFLECTION_ID_MAP } from '../models/storyMap';
import GLOBAL_VAR_MAP from '../models/globalVarMap';
import { GeneralBreadcrumbs } from '../components/GeneralBreadcrumbs/GeneralBreadcrumbs';
import {
  FlexBoxSpaceBetween,
  FlexBoxCenter,
  FlexBoxAlignColumn,
} from '../components/styled/general';
import { QrCode } from '@mui/icons-material';
import { CharacterAvatar } from '../components/CharacterAvatar/CharacterAvatar';
import { ChapterDetailsCard } from '../components/ChapterDetailsCard/ChapterDetailsCard';
import { GeneralProgressBar } from '../components/GeneralProgressBar/GeneralProgressBar';
import TableModal from '../components/Modals/TableModal';
import QrModal from '../components/Modals/QrModal';

const ClassesBar = (props) => {
  const { room, roomCode } = props;
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  return (
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
          <GeneralBreadcrumbs
            breadcrumbItems={[
              { label: 'Your Classes', link: '/' },
              { label: room?.name },
            ]}
          />
        </FlexBoxCenter>
        <FlexBoxCenter>
          <Typography variant='h4' sx={{ pr: '18px' }}>
            Class Code: {roomCode}
          </Typography>
          <QrCode
            sx={{
              color: (theme) => theme.palette.lapis[100],
              marginRight: 1,
              cursor: 'pointer',
            }}
            onClick={() => setIsQrModalOpen(true)}
            fontSize='large'
          />
          <QrModal
            isModalOpen={isQrModalOpen}
            setIsModalOpen={setIsQrModalOpen}
            roomCode={roomCode}
          />
        </FlexBoxCenter>
      </FlexBoxSpaceBetween>
    </Paper>
  );
};

const ChapterCard = (props) => {
  const {
    reflectionId,
    roomCode,
    completionRateNumerator,
    completionRateDenominator,
    handleReviewGameChoices,
  } = props;
  const { character, chapterId } = REFLECTION_ID_MAP[reflectionId];
  const navigate = useNavigate();

  return (
    <Paper
      key={reflectionId}
      sx={{
        top: 210,
        padding: '40px 32px',
        background: 'white',
        width: '80%',
        borderRadius: '30px',
        mb: '20px',
      }}
    >
      <Grid container sx={{ display: 'flex', height: '100%' }}>
        <Grid
          container
          spacing={3}
          sx={{ gridAutoRows: '1fr', alignItems: 'stretch' }}
        >
          <Grid
            item
            xs={1.5}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CharacterAvatar avatarContent={character} isLarge={true} />
            <Typography sx={{ fontWeight: 900, mt: 1 }} variant='h3'>
              {character}
            </Typography>
            <Typography sx={{ fontWeight: 700 }} variant='h4'>
              Chapter {chapterId}
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <ChapterDetailsCard
              sx={{
                backgroundColor: (theme) => theme.palette.midnight[100],
                cursor: 'pointer',
              }}
            >
              <Typography variant='h4' sx={{ fontWeight: 600 }}>
                Completion Rate
              </Typography>
              <GeneralProgressBar
                totalStudents={completionRateDenominator}
                completedStudents={completionRateNumerator}
              />
              <Typography
                variant='h4'
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  textDecoration: 'underline',
                }}
              >
                {completionRateNumerator}/{completionRateDenominator} students
                completed
              </Typography>
            </ChapterDetailsCard>
          </Grid>

          <Grid item xs={3.5}>
            <ChapterDetailsCard
              sx={{
                backgroundColor: (theme) => theme.palette.lapis.dark2,
                backgroundImage: 'url(/general/characters.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom 0 right 0',
                cursor: 'pointer',
              }}
              onClick={() =>
                navigate(
                  `/room/${roomCode}/reflectionId/${reflectionId}/reflections`
                )
              }
            >
              <Typography variant='h4'>View Reflections</Typography>
            </ChapterDetailsCard>
          </Grid>

          <Grid item xs={2}>
            <ChapterDetailsCard
              sx={{
                backgroundColor: (theme) => theme.palette.tangerine[80],
                backgroundImage: 'url(/general/background.png)',
                backgroundSize: 'cover',
                cursor: 'pointer',
              }}
              onClick={handleReviewGameChoices}
            >
              <Typography variant='h4' sx={{ textAlign: 'center' }}>
                Review Game Choices
              </Typography>
            </ChapterDetailsCard>
          </Grid>

          <Grid item xs={2}>
            <ChapterDetailsCard
              sx={{
                backgroundColor: (theme) => theme.palette.aqua[100],
                backgroundImage: 'url(/general/background.png)',
                backgroundSize: 'cover',
                cursor: 'pointer',
              }}
              onClick={() =>
                navigate(
                  `/room/${roomCode}/reflectionId/${reflectionId}/quizzes`
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
    </Paper>
  );
};

const Room = () => {
  const { roomCode } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [completionRateNumerators, setCompletionRateNumerators] = useState({});
  const [completionRateDenominator, setCompletionRateDenominator] =
    useState(null);

  // For table modals: game choices
  const [selectedReflectionId, setSelectedReflectionId] = useState(1);
  const [isGameChoicesModalOpen, setIsGameChoicesModalOpen] = useState(false);

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

    // Set table modal options
    setSelectedReflectionId(dbRoom.reflectionIds[0]);
  }

  useEffect(() => getRoom(), []);

  const chapter = GLOBAL_VAR_MAP.flatMap(
    (character) => character.chapters
  ).find((chapter) => chapter.reflectionId === selectedReflectionId);
  const gameChoices = chapter.variables;

  const rows = gameChoices.map((gameChoice) => {
    let characterName = gameChoice.name.split('_')[0];
    characterName =
      characterName.charAt(0).toUpperCase() + characterName.slice(1);
    let description = gameChoice.description.slice(0, 55);
    if (gameChoice.description.length > 55) {
      description += '...';
    }
    return [characterName, description];
  });

  const links = gameChoices.map(
    (_, choiceIdx) =>
      `/room/${roomCode}/reflectionId/${selectedReflectionId}/gameChoices/${choiceIdx}`
  );

  return (
    <Box
      sx={{
        height: 'calc(80% + 90px)',
        overflow: 'auto',
        paddingTop: '76px',
        paddingBottom: '25px',
      }}
    >
      <ClassesBar room={room} roomCode={roomCode} />

      <FlexBoxAlignColumn
        sx={{
          height: '100%',
          overflow: 'auto',
          background: (theme) => theme.palette.lapis[10],
        }}
      >
        <Box sx={{ padding: '12px' }} />
        {room?.reflectionIds.map((reflectionId) => {
          const handleReviewGameChoices = () => {
            setIsGameChoicesModalOpen(!isGameChoicesModalOpen);
            setSelectedReflectionId(reflectionId);
          };
          return (
            <ChapterCard
              key={reflectionId}
              reflectionId={reflectionId}
              roomCode={roomCode}
              completionRateNumerator={completionRateNumerators[reflectionId]}
              completionRateDenominator={completionRateDenominator}
              handleReviewGameChoices={handleReviewGameChoices}
            />
          );
        })}
      </FlexBoxAlignColumn>

      <TableModal
        isModalOpen={isGameChoicesModalOpen}
        setIsModalOpen={setIsGameChoicesModalOpen}
        label='Game choices'
        headers={['Character', 'Description']}
        rows={rows}
        links={links}
      />
    </Box>
  );
};

export default Room;
