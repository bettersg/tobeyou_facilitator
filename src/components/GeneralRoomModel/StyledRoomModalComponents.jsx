import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';
import {FlexBoxCenterColumnAlign} from "../styled/general"

export const ModalBox = styled(FlexBoxCenterColumnAlign)(({ theme, big }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor:'white',
  boxShadow: 24,
  borderRadius: '20px',
  padding: big ? "40px 0" : '80px',
}));

export const ModalBoxContentWrapper = styled(FlexBoxCenterColumnAlign)(({ theme, big }) => ({
  width: big ? "1000px" : "auto", 
  display: big ? "unset" : "",
}));

export const StyledModalStepIcon = styled('div')(({ theme, ownerState }) => ({
  zIndex: 1,
  color: theme.palette.lapis[0],
  width: 28,
  height: 28,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: theme.palette.lapis[20] + " 2px solid",
  ...(ownerState.active && {
    background: theme.palette.lapis[20],
  }),
  ...(ownerState.completed && {
    background: theme.palette.lapis[0],
    border: theme.palette.lapis[0] + " 2px solid",
    color: "white", 
  }),
}));

export const ModalStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16, 
    left: 'calc(-10%)',
    right: 'calc(90%)',
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: (theme) => theme.palette.lapis[0],
    borderTopWidth: 2,
    borderRadius: 1,
    height: 3, 
  },
}));

export const ModalRightSide = styled(FlexBoxCenterColumnAlign)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  width: '50%',
  height: '100%',
  backgroundColor: '#F5F4FD',
  borderRadius: '0 20px 20px 0',
}));

export const ModalLeftSide = styled(FlexBoxCenterColumnAlign)(({ theme }) => ({
  width: "50%", 
  paddingRight: "30px"
}));