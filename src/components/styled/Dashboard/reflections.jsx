import { styled } from '@mui/material/styles';
import { Box, Card } from '@mui/material';

export const Background = styled(Box)(({ theme, type }) => ({
  backgroundImage: 'url(/general/reflections_background.png)',
  // backgroundColor:
  //   type === 'gameChoices'
  //     ? theme.palette.tangerine[80]
  //     : theme.palette.aqua[100],
  backgroundSize: 'cover',
  color: 'white',
  height: '100%',
  width: '100%',
  padding: '36px 44px 0px',
}));

export const ReflectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 10,
  padding: '16px 24px',
  cursor: 'pointer',
  backgroundColor: '#26248F',
  color: 'white',
  width: 390,
  lineHeight: 1.5,
}));

export const CardContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

export const Description = styled(Box)(({ theme }) => ({
  marginBottom: 36,
}));

export const ModalInnerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  color: 'white',
}));

export const ModalImage = styled(Box)(({ theme }) => ({
  display: 'block',
  margin: '0px 0px -4px 0px',
  textAlign: 'center',
}));

export const ModalBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#26248F',
  color: 'white',
  padding: '20px 20px 0px 20px',
  borderRadius: 10,
  outline: 'none',
}));

export const ModalArrowBox = styled(Box)(({ theme }) => ({
  margin: 'auto',
  width: 20,
  cursor: 'pointer',
}));

export const ModalContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: 10,
}));
