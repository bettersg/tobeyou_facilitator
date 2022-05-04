import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
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
import {
  ModalBox,
  ModalRightSide,
  ModalLeftSide,
  ModalStepConnector,
  StyledModalStepIcon,
  ModalBoxContentWrapper,
} from './StyledRoomModalComponents';
import {
  FlexBoxCenterColumn,
  FlexBoxCenterColumnAlign,
  FlexBoxSpaceBetween,
  FlexBoxSpaceEvenly,
} from '../styled/general';
import { GeneralButton } from '../GeneralButton/GeneralButton';
import { GeneralTextField } from '../GeneralTextField/GeneralTextField';
import { CHARACTER_MAP } from '../../models/storyMap';
import { CharacterAvatar } from '../CharacterAvatar/CharacterAvatar';
import { useNavigate } from 'react-router';

import GLOBAL_VAR_MAP from '../../models/globalVarMap';

export const RoomModal = (props) => {
  const { isModalOpen, setIsModalOpen, label, roomCode, roomReflectionId, type } =
    props;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  let reflectionId = parseInt(roomReflectionId);
  const navigate = useNavigate();

  const chapter = GLOBAL_VAR_MAP.flatMap(
    (character) => character.chapters
  ).find((chapter) => chapter.reflectionId === reflectionId);
  const gameChoices = chapter.variables;

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby='modal-modal-title'
    >
      <ModalBox sx={{ alignItems: 'unset' }}>
        <Typography variant='h3' sx={{ mb: 2, ml: 1 }}>
          {label}
        </Typography>
        <TableContainer sx={{ maxHeight: '80%' }}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: (theme) => theme.palette.lapis[80] }}>
                  <Typography>Character</Typography>
                </TableCell>
                <TableCell sx={{ color: (theme) => theme.palette.lapis[80] }}>
                  <Typography>Description</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {type === 'gameChoices' ? (
              <TableBody>
                {gameChoices.map((choice, choiceIdx) => (
                  <TableRow
                    key={choice.name}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&: hover': { cursor: 'pointer' },
                    }}
                    onClick={() => {
                      navigate(
                        `/room/${roomCode}/reflectionId/${reflectionId}/gameChoices/${choiceIdx}`
                      );
                    }}
                  >
                    <TableCell component='th' scope='row'>
                      <Typography>
                        {choice.name.split('_')[0].charAt(0).toUpperCase() +
                          choice.name.split('_')[0].slice(1)}
                      </Typography>
                    </TableCell>
                    <TableCell align='right'>
                      <FlexBoxSpaceBetween>
                        <Typography>
                          {choice.description.slice(0, 55)}
                          {choice.description.length > 55 ? '...' : ''}
                        </Typography>
                        <ArrowForwardIos
                          sx={{ color: (theme) => theme.palette.lapis[100] }}
                        />
                      </FlexBoxSpaceBetween>
                    </TableCell>
                    {/* <TableCell align='right'>{row.fat}</TableCell>
                    <TableCell align='right'>{row.carbs}</TableCell>
                    <TableCell align='right'>{row.protein}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            ) : null}
          </Table>
        </TableContainer>
        {/* </Box> */}
      </ModalBox>
    </Modal>
  );
};
