import { styled } from '@mui/material/styles';
import { Box, Card, Button, IconButton } from '@mui/material';
import { FlexBoxSpaceBetween } from '../general';

export const Background = styled(Box)(({ theme, type }) => ({
  backgroundImage: 'url(/general/reflections_background.jpg)',
  backgroundSize: 'cover',
  overflowY: 'auto',
  color: 'white',
  height: 'calc(100% - 70px)', // to allow scroll to reach the bottom of the page
  padding: '36px 44px 0px',
}));

export const TopSection = styled(FlexBoxSpaceBetween)(
  ({ theme, type }) => ({})
);

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

export const Header = styled(Box)(({ theme }) => ({
  fontSize: '27px',
  fontStyle: 'normal',
  fontWeight: 700,
  marginTop: 28,
  marginBottom: 16,
}));

export const Description = styled(Box)(({ theme }) => ({
  fontSize: '18px',
  fontStyle: 'normal',
  fontWeight: 700,
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

export const FilterButton = styled(Button)(({ theme }) => ({
  borderRadius: '100px',
  backgroundColor: 'white',
  fontStyle: 'normal',
  fontWeight: 700,
  '&:hover': {
    backgroundColor: theme.palette.lapis[100],
    color: 'white',
  },
  margin: 2,
  padding: '6px 14px',
}));

export const SortButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '100px',
  backgroundColor: 'white',
  color: theme.palette.lapis[100],
  '&:hover': {
    backgroundColor: theme.palette.lapis[100],
    color: 'white',
  },
  margin: 2,
  padding: '6px 14px',
}));
