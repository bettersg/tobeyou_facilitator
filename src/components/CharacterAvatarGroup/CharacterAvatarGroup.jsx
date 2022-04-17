import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid } from '@mui/material';
import { FlexBoxCenter } from '../styled/general';
import { CharacterAvatar } from "../CharacterAvatar/CharacterAvatar"
import { REFLECTION_ID_MAP } from '../../models/storyMap';

const FlexEndGrid = styled(Grid)(({ theme }) => ({
    display: "flex", 
    justifyContent: "flex-end"
}));

const AddClassesBox = styled(FlexBoxCenter)(({ theme }) => ({
    backgroundColor: theme.palette.midnight[10], 
    border: "2px dashed " + theme.palette.midnight[20], 
    borderRadius: "12px", 
    minHeight: "152px", 
    width: "152px", 
    color: theme.palette.midnight[60]
}));

export const CharacterAvatarGroup = ({data, type}) => {
    
    return (
        <Grid container spacing={2}>
            <FlexEndGrid xs={12} >
                {data.length === 0 && type==="roomCard" ?
                    <AddClassesBox>Add a chapter</AddClassesBox>
                : null}
            </FlexEndGrid>
            {data.length <= 4 ?
                data.map((reflectionId, idx) => {
                    const { character, chapter } = REFLECTION_ID_MAP[reflectionId];
                    return (
                        <FlexEndGrid item xs={6} key={idx}>
                            <CharacterAvatar avatarContent={character} badgeContent={chapter} />
                        </FlexEndGrid>
                    )
                })
                : 
                data.slice(0, 3).map((reflectionId, idx) => {
                    const { character, chapter } = REFLECTION_ID_MAP[reflectionId];
                    return (
                        <FlexEndGrid item xs={6} key={idx}>
                            <CharacterAvatar avatarContent={character} badgeContent={chapter} />
                        </FlexEndGrid>
                    )
                })
            }
            {data.length > 4 ? 
                <FlexEndGrid item xs={6}>
                    <CharacterAvatar numExcess={`+${data.length-3}`} />
                </FlexEndGrid>
                : null
            }
        </Grid>
    )
}