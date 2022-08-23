import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import * as XLSX from 'xlsx';
import { useAuth } from '../contexts/AuthContext';
import { getDbReflectionResponses } from '../models/reflectionResponseModel';
import { getDbRoomByCode } from '../models/roomModel';
import { getDbQuizAnswersChartDatas } from '../models/quizAnswerModel';
import { getDbGameChoicesChartDatas } from '../models/savedStateModel';
import { getDbUser } from '../models/userModel';
import { REFLECTION_ID_MAP } from '../models/storyMap';
import GLOBAL_VAR_MAP from '../models/globalVarMap';
import { GeneralBreadcrumbs } from '../components/GeneralBreadcrumbs/GeneralBreadcrumbs';
import {
  FlexBoxSpaceBetween,
  FlexBoxCenter,
  FlexBoxAlignColumn,
} from '../components/styled/general';
import { Download, QrCode } from '@mui/icons-material';
import { CharacterAvatar } from '../components/CharacterAvatar/CharacterAvatar';
import { ChapterDetailsCard } from '../components/ChapterDetailsCard/ChapterDetailsCard';
import { GeneralProgressBar } from '../components/GeneralProgressBar/GeneralProgressBar';
import TableModal from '../components/Modals/TableModal';
import QrModal from '../components/Modals/QrModal';

async function getAllRoomData(roomCode, reflectionIds, participantIds) {
  // reflection responses
  const reflectionResponsesData = [['Chapter', 'Reflection']];
  for (const reflectionId of reflectionIds) {
    const { character, chapterId } = REFLECTION_ID_MAP[reflectionId];
    const chapterCell = `${character} Chapter ${chapterId}`;
    const reflectionResponses = await getDbReflectionResponses(
      roomCode,
      reflectionId,
      true
    );
    const filteredReflectionResponses = reflectionResponses.filter(
      (rr) => rr.answer.length > 5
    );
    filteredReflectionResponses.forEach((reflectionResponse) => {
      const reflectionCell = reflectionResponse.answer;
      const row = [chapterCell, reflectionCell];
      reflectionResponsesData.push(row);
    });
  }

  // game choices
  const gameChoicesData = [
    ['Chapter', 'Scenario', 'Choice', 'Number of responses'],
  ];
  for (const reflectionId of reflectionIds) {
    const { character, chapterId } = REFLECTION_ID_MAP[reflectionId];
    const chapterCell = `${character} Chapter ${chapterId}`;
    const gameChoices = await getDbGameChoicesChartDatas(
      reflectionId,
      participantIds
    );
    gameChoices.forEach((gameChoice) => {
      const scenarioCell = gameChoice.title;
      for (let i = 0; i < gameChoice.labels.length; i++) {
        const choiceCell = gameChoice.labels[i];
        const numResponsesCell = gameChoice.data[i];
        const row = [chapterCell, scenarioCell, choiceCell, numResponsesCell];
        gameChoicesData.push(row);
      }
    });
  }

  // quiz answers
  const quizAnswersData = [
    ['Chapter', 'Question', 'Option', 'Number of responses', 'Correct Answer?'],
  ];
  for (const reflectionId of reflectionIds) {
    const { character, chapterId } = REFLECTION_ID_MAP[reflectionId];
    const chapterCell = `${character} Chapter ${chapterId}`;
    const quizAnswers = await getDbQuizAnswersChartDatas(
      roomCode,
      reflectionId
    );
    quizAnswers.forEach((quizAnswer) => {
      const questionCell = quizAnswer.title;
      for (let i = 0; i < quizAnswer.labels.length; i++) {
        const optionCell = quizAnswer.labels[i];
        const numResponsesCell = quizAnswer.data[i];
        const correctAnswerCell =
          i === quizAnswer.correctAnswerIdx ? 'True' : 'False';
        const row = [
          chapterCell,
          questionCell,
          optionCell,
          numResponsesCell,
          correctAnswerCell,
        ];
        quizAnswersData.push(row);
      }
    });
  }

  return { reflectionResponsesData, gameChoicesData, quizAnswersData };
}

function exportRoomData(
  roomCode,
  reflectionResponsesData,
  gameChoicesData,
  quizAnswersData
) {
  const wb = XLSX.utils.book_new();
  const title = `ToBeYou Facilitator - Room ${roomCode}.xlsx`;
  wb.SheetNames.push('Reflections');
  wb.SheetNames.push('Game Choices');
  wb.SheetNames.push('Quiz Answers');
  const reflectionWs = XLSX.utils.aoa_to_sheet(reflectionResponsesData);
  const gameChoicesWs = XLSX.utils.aoa_to_sheet(gameChoicesData);
  const quizAnswersWs = XLSX.utils.aoa_to_sheet(quizAnswersData);
  wb.Sheets.Reflections = reflectionWs;
  wb.Sheets['Game Choices'] = gameChoicesWs;
  wb.Sheets['Quiz Answers'] = quizAnswersWs;
  XLSX.writeFile(wb, title);
}

const ClassesBar = (props) => {
  const { room, roomCode, reflectionIds, participantIds } = props;
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
          <Download
            sx={{
              color: (theme) =>
                isDownloading
                  ? theme.palette.lapis[40]
                  : theme.palette.lapis[100],
              marginRight: 1,
              cursor: isDownloading ? 'default' : 'pointer',
            }}
            onClick={async () => {
              if (isDownloading) return;
              setIsDownloading(true);
              const {
                reflectionResponsesData,
                gameChoicesData,
                quizAnswersData,
              } = await getAllRoomData(roomCode, reflectionIds, participantIds);
              exportRoomData(
                roomCode,
                reflectionResponsesData,
                gameChoicesData,
                quizAnswersData
              );
              setIsDownloading(false);
            }}
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
    handleCompletionRate,
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
              onClick={handleCompletionRate}
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

  // For completion rate
  // - Numerator IDs: IDs of participants in the room who've completed the given reflection, indexed by reflection ID
  // - Denominator IDs: IDs of all participants in the room
  const [completionRateNumeratorIds, setCompletionRateNumeratorIds] = useState(
    {}
  );
  const [completionRateDenominatorIds, setCompletionRateDenominatorIds] =
    useState(null);
  const [participantsIdToEmailMap, setParticipantsIdToEmailMap] = useState({});

  // For table modals (completion rate and game choices)
  const [selectedReflectionId, setSelectedReflectionId] = useState(1);
  const [isCompletionRateModalOpen, setIsCompletionRateModalOpen] =
    useState(false);
  const [isGameChoicesModalOpen, setIsGameChoicesModalOpen] = useState(false);

  async function getRoom() {
    const dbRoom = await getDbRoomByCode(roomCode);
    if (!dbRoom || !dbRoom.facilitatorIds.includes(currentUser.id)) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    setRoom(dbRoom);

    // Set table modal options
    setSelectedReflectionId(dbRoom.reflectionIds[0]);

    // Get completion rate statistics (numerator and denominator IDs)
    const allReflectionResponses = await getDbReflectionResponses(
      roomCode,
      null,
      true
    );
    const numeratorIds = {};
    for (const reflectionId of dbRoom.reflectionIds) {
      const reflectionResponses = allReflectionResponses.filter(
        (rr) => rr.reflectionId === reflectionId
      );
      const userIdsWithReflection = reflectionResponses.map((rr) => rr.userId);
      const userIdsInRoomWithReflection = userIdsWithReflection.filter(
        (userId) => dbRoom.participantIds.includes(userId)
      );
      const uniqueUserIdsInRoomWithReflection = [
        ...new Set(userIdsInRoomWithReflection),
      ];
      numeratorIds[reflectionId] = uniqueUserIdsInRoomWithReflection;
    }
    setCompletionRateNumeratorIds(numeratorIds);
    setCompletionRateDenominatorIds(dbRoom.participantIds);

    // Get participant emails for completion rate - have to perform N+1 query unfortunately
    const participants = await Promise.all(
      dbRoom.participantIds.map((participantId) => getDbUser(participantId))
    );
    const participantsIdToEmailMap = {};
    for (let participant of participants) {
      participantsIdToEmailMap[participant.id] = participant.email;
    }
    setParticipantsIdToEmailMap(participantsIdToEmailMap);
  }

  useEffect(() => getRoom(), []);

  const gameChoices = GLOBAL_VAR_MAP.flatMap(
    (character) => character.chapters
  ).find((chapter) => chapter.reflectionId === selectedReflectionId).variables;

  // Data for game choices modal
  const gameChoicesModalHeaders = ['Character', 'Description'];
  let characterName = gameChoices[0].name.split('_')[0];
  characterName =
    characterName.charAt(0).toUpperCase() + characterName.slice(1);
  const gameChoicesModalRows = gameChoices.map((gameChoice) => {
    let description = gameChoice.description.slice(0, 55);
    if (gameChoice.description.length > 55) {
      description += '...';
    }
    return [characterName, description];
  });
  gameChoicesModalRows.push([characterName, 'Chapter ending']);
  const gameChoicesModalLinks = [];
  for (let i = 0; i < gameChoices.length + 1; i++) {
    gameChoicesModalLinks.push(
      `/room/${roomCode}/reflectionId/${selectedReflectionId}/gameChoices/${i}`
    );
  }

  // Data for completion rate modal
  const completionRateModalHeaders = ['Email', 'Completed?'];
  const completionRateModalRows =
    completionRateDenominatorIds?.map((participantId) => {
      const participantEmail = participantsIdToEmailMap[participantId];
      const completed = completionRateNumeratorIds[
        selectedReflectionId
      ].includes(participantId)
        ? 'Y'
        : 'N';
      return [participantEmail, completed];
    }) || [];

  return (
    <Box
      sx={{
        height: 'calc(80% + 90px)',
        overflow: 'auto',
        paddingTop: '76px',
        paddingBottom: '25px',
      }}
    >
      <ClassesBar
        room={room}
        roomCode={roomCode}
        reflectionIds={room?.reflectionIds}
        participantIds={room?.participantIds}
      />

      <FlexBoxAlignColumn
        sx={{
          height: '100%',
          overflow: 'auto',
          background: (theme) => theme.palette.lapis[10],
        }}
      >
        <Box sx={{ padding: '12px' }} />
        {room?.reflectionIds.map((reflectionId) => {
          const handleCompletionRate = () => {
            setIsCompletionRateModalOpen((isOpen) => !isOpen);
            setSelectedReflectionId(reflectionId);
          };
          const handleReviewGameChoices = () => {
            setIsGameChoicesModalOpen((isOpen) => !isOpen);
            setSelectedReflectionId(reflectionId);
          };
          return (
            <ChapterCard
              key={reflectionId}
              reflectionId={reflectionId}
              roomCode={roomCode}
              completionRateNumerator={
                completionRateNumeratorIds[reflectionId]?.length
              }
              completionRateDenominator={completionRateDenominatorIds?.length}
              handleCompletionRate={handleCompletionRate}
              handleReviewGameChoices={handleReviewGameChoices}
            />
          );
        })}
      </FlexBoxAlignColumn>

      <TableModal
        label={`Completion rate (${completionRateNumeratorIds[selectedReflectionId]?.length}/${completionRateDenominatorIds?.length} completed)`}
        isModalOpen={isCompletionRateModalOpen}
        setIsModalOpen={setIsCompletionRateModalOpen}
        headers={completionRateModalHeaders}
        rows={completionRateModalRows}
      />

      <TableModal
        label='Game choices'
        isModalOpen={isGameChoicesModalOpen}
        setIsModalOpen={setIsGameChoicesModalOpen}
        headers={gameChoicesModalHeaders}
        rows={gameChoicesModalRows}
        links={gameChoicesModalLinks}
      />
    </Box>
  );
};

export default Room;
