import { styled } from '@mui/material/styles';
import { FlexBoxCenterColumnAlign } from '../styled/general';

export const ChapterDetailsCard = styled(FlexBoxCenterColumnAlign)(
  ({ theme }) => ({
    borderRadius: '16px',
    color: 'white',
    padding: '32px',
    height: 'calc(100% - 64px)',
    marginBottom: '16px',
  })
);
