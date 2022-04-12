import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid } from '@mui/material';
import { CharacterAvatar } from "../CharacterAvatar/CharacterAvatar"
import { REFLECTION_ID_MAP } from '../../models/storyMap';

const FlexEndGrid = styled(Grid)(({ theme }) => ({
    display: "flex", 
    justifyContent: "flex-end"
}));

export const CharacterAvatarGroup = ({data}) => {
    
    return (
        <Grid container spacing={2}>
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