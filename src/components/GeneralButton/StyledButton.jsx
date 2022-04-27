import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledButton = styled(Button)(({theme, customcolor}) => ({
    borderRadius: "50px", 
    background: customcolor==="lapis10"?theme.palette.lapis[10]:"", 
    color: customcolor==="lapis10"?theme.palette.lapis[100]:"", 
    "&:hover":{
        backgroundColor: customcolor==="lapis10"?theme.palette.lapis[20]:"", 

    }
})) 