import { Box } from '@mui/material';
import React from 'react';
import { FlexBoxAlign } from '../styled/general';

export const GeneralProgressBar = ({
  completedStudents,
  totalStudents,
  hasPercentage,
}) => {
  const percentage = Math.round((completedStudents / totalStudents) * 100);
  return (
    <FlexBoxAlign
      sx={{
        borderRadius: '40px',
        background: '#005B6966',
        width: '100%',
        height: '46px',
        margin: '24px 0',
      }}
    >
      <Box
        sx={{
          borderRadius: '40px',
          background: (theme) => theme.palette.aqua[20],
          width: `${percentage}%`,
          height: '46px',
          margin: '24px 0',
        }}
      ></Box>
    </FlexBoxAlign>
  );
};
