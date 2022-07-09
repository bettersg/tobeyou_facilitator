import React from 'react';
import { Box, Typography } from '@mui/material';
import { FlexBoxAlign } from '../styled/general';

export const GeneralProgressBar = ({ completedStudents, totalStudents }) => {
  const percentage = Math.round((completedStudents / totalStudents) * 100);
  return (
    <FlexBoxAlign
      sx={{
        borderRadius: '12px',
        background: (theme) => theme.palette.aqua[10],
        width: '100%',
        height: '40px',
        margin: '16px 0',
      }}
    >
      <Box
        sx={{
          borderRadius: '12px 0 0 12px',
          background: (theme) => theme.palette.aqua[100],
          width: `${percentage}%`,
          height: '40px',
          margin: '16px 0',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '24px',
            position: 'relative',
            textAlign: 'center',
            color: (theme) => theme.palette.midnight.dark1,
          }}
        >
          {isNaN(percentage) ? null : `${percentage}%`}
        </Typography>
      </Box>
    </FlexBoxAlign>
  );
};
