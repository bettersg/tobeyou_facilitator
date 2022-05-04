import { styled } from '@mui/material/styles';
import { Breadcrumbs, Link, Box, Paper } from '@mui/material';
import {FlexBoxCenterColumnAlign} from "../../components/styled/general"

export const ChoicesBackground = styled(FlexBoxCenterColumnAlign)(({ theme, type }) => ({
    backgroundImage: "url(/choices_screen/background.png)",
    backgroundColor: type === "gameChoices" ? theme.palette.aqua[100] : theme.palette.tangerine[80], 
    backgroundSize: "cover",
    height: "100%", 
    width: "100%", 
}));

export const ChoicesPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '80px',
}));
