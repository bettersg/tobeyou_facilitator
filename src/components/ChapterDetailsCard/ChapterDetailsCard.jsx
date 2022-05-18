import { styled } from '@mui/material/styles';
import { FlexBoxCenterColumnAlign } from '../styled/general';

export const ChapterDetailsCard = styled(FlexBoxCenterColumnAlign)(
  ({ theme }) => ({
    borderRadius: '24px',
    color: 'white',
    padding: '24px',
    height: 'calc(100% - 48px)',
    marginBottom: '16px',
  })
);
