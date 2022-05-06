import React, { useEffect, useState } from 'react';
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
  ChangeHistoryRounded,ClearRounded, 
} from '@mui/icons-material';
import {
  FlexBoxAlign,
  FlexBoxCenterColumnAlign,
  FlexBoxSpaceBetween,
} from '../../components/styled/general';
import {
  ChoicesBackground,
  ChoicesPaper,
} from './ChoicesScreenStyledComponents';
import { ModalBox } from '../GeneralRoomModal/StyledRoomModalComponents';
import { ChoicesCharts } from '../ChoicesCharts/ChoicesCharts';
import { useNavigate, useParams } from 'react-router';

export const ChoicesScreen = ({
  title,
  type = 'gameChoices',
  children,
  gameChoiceValues,
  userChoices,
  onKeyDown,
  onLeft,
  onRight,
  ...props
}) => {
  let { roomId, reflectionId, choiceIdx } = useParams();

  return (
    <ChoicesBackground type={type} onKeyDown={onKeyDown} {...props}>
        <Link href={`/room/${roomId}`}>
            <ClearRounded fontSize="large" sx={{position: "absolute", top: 80, right: 50, color: "white"}} />
        </Link>
      <Typography
        variant='h3'
        sx={{
          fontSize: '52px',
          color: 'white',
          mb: 5,
          maxWidth: '80%',
          textAlign: 'center',
          mt: "-100px", 
        }}
      >
        {title}
      </Typography>
      <FlexBoxSpaceBetween sx={{ width: '90%' }}>
        <ChangeHistoryRounded
          sx={{
            color: 'white',
            transform: 'rotate(270deg)',
            '&:hover': { cursor: 'pointer' },
          }}
          onClick={onLeft}
          fontSize='large'
        />

        <ChoicesPaper>
          <ChoicesCharts
            gameChoiceValues={gameChoiceValues}
            userChoices={userChoices}
          />
        </ChoicesPaper>
        <ChangeHistoryRounded
          sx={{
            color: 'white',
            transform: 'rotate(90deg)',
            '&:hover': { cursor: 'pointer' },
          }}
          onClick={onRight}
          fontSize='large'
        />
      </FlexBoxSpaceBetween>
    </ChoicesBackground>
  );
};
