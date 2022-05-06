import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
import {
  FlexBoxCenterColumnAlign,
  FlexBoxAlign,
} from '../../components/styled/general';

export const ChoicesBackground = styled(FlexBoxCenterColumnAlign)(
  ({ theme, type }) => ({
    backgroundImage: 'url(/choices_screen/background.png)',
    backgroundColor:
      type === 'gameChoices'
        ? theme.palette.tangerine[80]
        : theme.palette.aqua[100],
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',
  })
);

export const ChoicesPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '80px',
  maxWidth: '80%',
  maxHeight: '70%',
  zIndex: 2,
}));

export const InfoBox = styled(FlexBoxAlign)(({ theme }) => ({
  backgroundColor: theme.palette.aqua[40],
  borderRadius: '20px 0 0 20px',
  padding: '20px 15px',

  position: 'relative',
  top: -60,
  left: -140,
  width: '30px',
}));
