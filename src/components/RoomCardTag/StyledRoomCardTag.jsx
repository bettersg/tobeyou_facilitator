import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';

export const StyledRoomCardTag = styled(Chip)(({ theme }) => ({
  textTransform: 'uppercase',
  background: theme.palette.aqua[1],
  padding: '4px 8px',
  color: 'white',
  fontWeight: 600,
  letterSpacing: '0.05em',
  border: 'unset',
}));
