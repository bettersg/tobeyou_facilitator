import React from 'react';
import { StyledRoomCardTag } from './StyledRoomCardTag';

export const RoomCardTag = ({ status, ...props }) => {
  return (
    <StyledRoomCardTag
      {...props}
      sx={{
        backgroundColor: !status ? (theme) => theme.palette.midnight[60] : '',
      }}
    />
  );
};
