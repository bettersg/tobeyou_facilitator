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
  ChangeHistoryRounded,
  ClearRounded,
  InfoOutlined,
} from '@mui/icons-material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {
  FlexBoxAlign,
  FlexBoxCenterColumnAlign,
  FlexBoxSpaceBetween,
} from '../../components/styled/general';
import {
  ChoicesBackground,
  ChoicesPaper,
  InfoBox,
} from './ChoicesScreenStyledComponents';
import { ModalBox } from '../GeneralRoomModal/StyledRoomModalComponents';
import { ChoicesCharts } from '../GeneralCharts/ChoicesCharts';
import { useNavigate, useParams } from 'react-router';
import { QuizCharts } from '../GeneralCharts/QuizCharts';
import { GeneralTooltip } from '../GeneralTooltip/GeneralTooltip';

export const ChoicesScreen = ({
  title = '',
  type = 'gameChoices',
  children,
  gameChoiceValues,
  userChoices,
  onKeyDown,
  onLeft,
  onRight,
  tooltipTitle,
  ...props
}) => {
  let { roomCode, reflectionId, choiceIdx } = useParams();

  return (
    <ChoicesBackground type={type} onKeyDown={onKeyDown} {...props}>
      <Link href={`/room/${roomCode}`}>
        <ClearRounded
          fontSize='large'
          sx={{ position: 'absolute', top: 80, right: 50, color: 'white' }}
        />
      </Link>
      <Typography
        variant='h3'
        sx={{
          fontSize: '52px',
          color: 'white',
          mb: 5,
          maxWidth: '80%',
          textAlign: 'center',
          mt: '-100px',
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
          {tooltipTitle ? (
            <GeneralTooltip title={tooltipTitle} arrow>
              <InfoBox>
                <InfoOutlined
                  sx={{
                    transform: 'rotate(10deg)',
                  }}
                />
              </InfoBox>
            </GeneralTooltip>
          ) : null}
          <Box mt={tooltipTitle ? '-80px' : ''}>
            {type === 'gameChoices' ? (
              <ChoicesCharts
                gameChoiceValues={gameChoiceValues}
                userChoices={userChoices}
              />
            ) : type === 'quizzes' ? (
              <QuizCharts
                gameChoiceValues={gameChoiceValues}
                userChoices={userChoices}
              />
            ) : null}
          </Box>
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
