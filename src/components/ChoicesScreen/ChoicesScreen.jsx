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
  } from '@mui/icons-material';
  import { FlexBoxAlign, FlexBoxCenterColumnAlign } from '../../components/styled/general';
  import { ChoicesBackground, ChoicesPaper } from './ChoicesScreenStyledComponents';
import { ModalBox } from '../GeneralRoomModal/StyledRoomModalComponents';

  export const ChoicesScreen = ({title, type="gameChoices"}) => {
      return (
          <ChoicesBackground type={type}>
              <Typography variant="h3" sx={{ fontSize: "52px", color: "white", mb: 5}}>{title}</Typography>
              <ChoicesPaper>
                  hi
              </ChoicesPaper>
          </ChoicesBackground>
      )
  }