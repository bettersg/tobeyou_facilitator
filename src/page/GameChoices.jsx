import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getDbSavedState } from '../models/savedStateModel';
import { getDbRoomByCode } from '../models/roomModel';
import { useEventListener } from '../utils';
import { REFLECTION_ID_MAP } from '../models/storyMap';
import GLOBAL_VAR_MAP from '../models/globalVarMap';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link,
  Modal,
  Step,
  Stepper,
  StepLabel,
  TextField,
  Typography,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
} from '@mui/material';
import {
  ContentCopy,
  MailOutline,
  WhatsApp,
  Check,
  CheckCircleOutline,
  Close,
  ArrowForwardIos,
} from '@mui/icons-material';
import { FlexBoxAlign, FlexBoxCenterColumnAlign } from '../components/styled/general';
import { ChoicesScreen } from '../components/ChoicesScreen/ChoicesScreen';

const GameChoices = () => {
  let { roomCode, reflectionId, choiceIdx } = useParams();
  reflectionId = parseInt(reflectionId);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentGameChoiceIndex, setCurrentGameChoiceIndex] = useState(choiceIdx);
  const [allGlobalVariables, setAllGlobalVariables] = useState(null);

  const chapter = GLOBAL_VAR_MAP.flatMap(
    (character) => character.chapters
  ).find((chapter) => chapter.reflectionId === reflectionId);
  const gameChoices = chapter.variables;

  async function getData() {
    const dbRoom = await getDbRoomByCode(roomCode);
    if (
      !dbRoom ||
      !dbRoom.facilitatorIds.includes(currentUser.id) ||
      !dbRoom.reflectionIds.includes(reflectionId)
    ) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    const { characterId } = REFLECTION_ID_MAP[reflectionId];
    const savedStateIds = dbRoom.participantIds.map(
      (participantId) => `${participantId}-${characterId}`
    );
    // Have to perform N+1 query unfortunately, can potentially be a performance issue
    const dbSavedStates = await Promise.all(savedStateIds.map(getDbSavedState));
    const dbAllGlobalVariables = dbSavedStates.map(
      (dbSavedState) => dbSavedState.globalVariables
    );
    setAllGlobalVariables(dbAllGlobalVariables);
  }

  const handleLeft = () => {
    setCurrentGameChoiceIndex(Math.max(0, currentGameChoiceIndex - 1));
  };

  const handleRight = () => {
    setCurrentGameChoiceIndex(
      Math.min(gameChoices.length - 1, currentGameChoiceIndex + 1)
    );
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 37) {
      handleLeft();
    } else if (event.keyCode === 39) {
      handleRight();
    }
  };

  useEffect(() => getData(), []);
  useEventListener('keydown', handleKeyDown);

  const gameChoice = gameChoices[currentGameChoiceIndex];
  const userChoices = allGlobalVariables?.map(
    (globalVariables) => globalVariables[gameChoice.name]
  );

  return (
    <ChoicesScreen title={gameChoice.description} onKeyDown={handleKeyDown} onLeft={handleLeft} onRight={handleRight} gameChoiceValues={gameChoice.values} userChoices={userChoices}>
    </ChoicesScreen>
    // <FlexBoxCenterColumnAlign  sx={{height: "100%", width: "100%"}}>
    //   <Typography variant="h3">{gameChoice.description}</Typography>
    //   <Paper>
    //   </Paper>
    //   <p>Note: use left/right arrow keys to scroll through game choices</p>
    // </FlexBoxCenterColumnAlign>
  );
};

export default GameChoices;
