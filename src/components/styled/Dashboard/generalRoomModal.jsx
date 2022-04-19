import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';

export const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  backgroundColor: 'white',
  boxShadow: 24,
  padding: 30,
  borderRadius: '20px',
  paddingBottom: '80px',
}));

export const ModalStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#664EFC',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

export const ModalRightSide = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  width: '50%',
  height: '100%',
  backgroundColor: '#F5F4FD',
  borderRadius: '0 20px 20px 0',
}));
