import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  ChangeHistoryRounded,
  ClearRounded,
  InfoOutlined,
} from '@mui/icons-material';
import { FlexBoxSpaceBetween } from '../../components/styled/general';
import {
  ChoicesBackground,
  ChoicesPaper,
  InfoBox,
} from './ChoicesScreenStyledComponents';
import { ChoicesCharts } from '../GeneralCharts/ChoicesCharts';
import { QuizCharts } from '../GeneralCharts/QuizCharts';
import { GeneralTooltip } from '../GeneralTooltip/GeneralTooltip';
import { useEventListener } from '../../utils';

export const ChoicesScreen = ({
  type, // 'gameChoices' or 'quizzes'
  children,
  initialIndex,
  data,
  options,
  ...props
}) => {
  const { roomCode } = useParams();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  let userChoices, gameChoiceValues, title, tooltipTitle;
  if (type === 'gameChoices') {
    const gameChoice = options[currentIndex];
    userChoices = data?.map(
      (globalVariables) => globalVariables[gameChoice.name]
    );
    title = gameChoice.description;
    gameChoiceValues = gameChoice.values;
  } else if (type === 'quizzes') {
    const miniGameResult = options[currentIndex];
    title = miniGameResult.question;
    gameChoiceValues = miniGameResult.answers;
    tooltipTitle = miniGameResult.explanation;
  }

  const handleLeft = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleRight = () => {
    setCurrentIndex(Math.min(options.length - 1, currentIndex + 1));
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 37) {
      handleLeft();
    } else if (event.keyCode === 39) {
      handleRight();
    }
  };

  useEventListener('keydown', handleKeyDown);

  return (
    <ChoicesBackground type={type} onKeyDown={handleKeyDown} {...props}>
      <Link to={`/room/${roomCode}`}>
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
          onClick={handleLeft}
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
              <QuizCharts gameChoiceValues={gameChoiceValues} />
            ) : null}
          </Box>
        </ChoicesPaper>
        <ChangeHistoryRounded
          sx={{
            color: 'white',
            transform: 'rotate(90deg)',
            '&:hover': { cursor: 'pointer' },
          }}
          onClick={handleRight}
          fontSize='large'
        />
      </FlexBoxSpaceBetween>
    </ChoicesBackground>
  );
};
