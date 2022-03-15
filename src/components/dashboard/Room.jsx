import React, { useEffect, useState } from 'react';
import {
  Edit,
  KeyboardArrowDown,
  KeyboardArrowLeft,
} from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDbRoom } from '../../models/roomModel';
import { REFLECTION_ID_MAP } from '../../models/storyMap';

const Room = () => {
  let { roomId, reflectionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  reflectionId = parseInt(reflectionId);
  const { character, chapter } = REFLECTION_ID_MAP[reflectionId];

  async function getRoom() {
    const dbRoom = await getDbRoom(roomId);
    if (
      !dbRoom ||
      !dbRoom.facilitatorIds.includes(currentUser.id) ||
      !dbRoom.reflectionIds.includes(reflectionId)
    ) {
      navigate('/'); // redirect if the room does not exist, or facilitator is unauthorised to access it
    }
    setRoom(dbRoom);
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleMenuItemClick(newReflectionId) {
    handleClose();
    navigate(`/room/${roomId}/reflectionId/${newReflectionId}`);
  }

  useEffect(() => getRoom(), []);

  return (
    <div>
      <h3>
        <KeyboardArrowLeft onClick={() => navigate('/')} />{' '}
        {room ? room.name : null} <Edit />
      </h3>
      <h4>
        {character} / Chapter {chapter}{' '}
        <Button onClick={handleClick}>
          <KeyboardArrowDown />
        </Button>
      </h4>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {room
          ? Object.keys(REFLECTION_ID_MAP)
              .filter((reflectionId) =>
                room.reflectionIds.includes(parseInt(reflectionId))
              )
              .map((reflectionId) => {
                const { character, chapter } = REFLECTION_ID_MAP[reflectionId];
                return (
                  <MenuItem
                    key={reflectionId}
                    onClick={() => handleMenuItemClick(reflectionId)}
                  >
                    {character} / Chapter {chapter}
                  </MenuItem>
                );
              })
          : null}
      </Menu>
      <p
        style={{ cursor: 'pointer' }}
        onClick={() =>
          navigate(
            `/room/${roomId}/reflectionId/${reflectionId}/completionRate`
          )
        }
      >
        Completion Rate
      </p>
      <p
        style={{ cursor: 'pointer' }}
        onClick={() =>
          navigate(`/room/${roomId}/reflectionId/${reflectionId}/reflections`)
        }
      >
        Reflections
      </p>
      <p
        style={{ cursor: 'pointer' }}
        onClick={() =>
          navigate(`/room/${roomId}/reflectionId/${reflectionId}/quizzes`)
        }
      >
        Mini Game
      </p>
    </div>
  );
};

export default Room;
