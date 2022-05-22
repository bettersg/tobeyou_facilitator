import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  ChangeHistoryRounded,
  ClearRounded,
  InfoOutlined,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FlexBoxSpaceBetween } from '../styled/general';
import {
  ChartBackground,
  ChartPaper,
  InfoBox,
} from './ChartScreenStyledComponents';
import { GeneralTooltip } from '../GeneralTooltip/GeneralTooltip';
import { breakIntoLines, useEventListener } from '../../utils';

ChartJS.register(
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend
);

const Chart = ({ chartData, barColor }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    events: [],

    layout: {
      padding: {
        top: 50,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: '#464E75',
        font: {
          size: '24px',
          weight: 'bold',
        },
        formatter: function (value, ctx) {
          if (!chartData) return '';
          const percentage =
            Math.round((value * 100) / chartData.totalCount) || 0;
          return `${percentage}% (${value}/${chartData.totalCount})`;
        },
        anchor: 'end',
        align: 'top',
      },
    },
    scales: {
      y: {
        grid: {
          color: 'white',
        },
        ticks: {
          stepSize: 1,
          font: {
            size: '18px',
            weight: 700,
            maxWidth: '50px',
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: '18px',
            weight: 700,
            maxWidth: '50px',
          },
        },
      },
    },
  };

  const data = {
    labels: chartData?.brokenLabels,
    datasets: [
      {
        data: chartData?.data,
        backgroundColor: barColor,
        borderRadius: 8,
      },
    ],
  };

  return (
    <Bar
      options={options}
      data={data}
      style={{ height: '450px', width: '1000px' }}
    />
  );
};

const ChartScreen = ({
  type, // 'gameChoices' or 'quizzes'
  chartDatas,
  initialIndex,
}) => {
  const { roomCode } = useParams();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleLeft = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleRight = () => {
    setCurrentIndex(Math.min(chartDatas.length - 1, currentIndex + 1));
  };

  const handleKeyDown = (event) => {
    if (!chartDatas) return;
    if (event.keyCode === 37) {
      handleLeft();
    } else if (event.keyCode === 39) {
      handleRight();
    }
  };

  useEventListener('keydown', handleKeyDown);

  const chartData = chartDatas ? chartDatas[currentIndex] : null;
  if (chartData) {
    chartData.brokenLabels = breakIntoLines(chartData.labels);
    chartData.totalCount = chartData.data.reduce((val, acc) => val + acc, 0);
  }

  const leftArrowStyle = {
    color: 'white',
    transform: 'rotate(270deg)',
    '&:hover': { cursor: 'pointer' },
  };
  const rightArrowStyle = {
    color: 'white',
    transform: 'rotate(90deg)',
    '&:hover': { cursor: 'pointer' },
  };

  if (currentIndex === 0) {
    leftArrowStyle.visibility = 'hidden';
  }
  if (currentIndex === chartDatas?.length - 1) {
    rightArrowStyle.visibility = 'hidden';
  }

  return (
    <ChartBackground type={type} onKeyDown={handleKeyDown}>
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
        {chartData?.title}
      </Typography>
      <FlexBoxSpaceBetween sx={{ width: '90%' }}>
        <ChangeHistoryRounded
          sx={leftArrowStyle}
          onClick={handleLeft}
          fontSize='large'
        />
        <ChartPaper>
          {chartData?.tooltip ? (
            <GeneralTooltip title={chartData?.tooltip || ''} arrow>
              <InfoBox>
                <InfoOutlined
                  sx={{
                    transform: 'rotate(10deg)',
                  }}
                />
              </InfoBox>
            </GeneralTooltip>
          ) : null}
          <Box mt={chartDatas?.tooltip ? '-80px' : ''}>
            <Chart
              chartData={chartData}
              barColor={type === 'gameChoices' ? '#FF8944' : '#3DCAD3'}
            />
          </Box>
        </ChartPaper>
        <ChangeHistoryRounded
          sx={rightArrowStyle}
          onClick={handleRight}
          fontSize='large'
        />
      </FlexBoxSpaceBetween>
    </ChartBackground>
  );
};

export default ChartScreen;
