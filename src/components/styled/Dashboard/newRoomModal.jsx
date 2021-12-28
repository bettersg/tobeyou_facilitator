import { alpha, styled } from '@mui/material/styles';
import { Box, Button, TextField, Typography, InputBase, ToggleButtonGroup } from '@mui/material';

export const ModalBox = styled(Box)(({theme}) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    backgroundColor: 'white',
    boxShadow: 24,
    padding: 20,
    borderRadius: 10, 
})) 
