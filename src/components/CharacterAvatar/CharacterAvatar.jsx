import React from 'react';
import { AvatarGroup, Avatar, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: theme.palette.chicky[100],
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      fontWeight: 700, 
    },
}));

export const CharacterAvatar = ({avatarContent, badgeContent, numExcess}) => {
    return (
        // for avatar with chapter number on the bottom right
        badgeContent ? 
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={badgeContent}
            >
                <Avatar alt={avatarContent} src={`/avatar/${avatarContent.toLowerCase()}.png`} sx={{ width: 56, height: 56 }}/>
            </StyledBadge>
        :
        
        // for grouped avatar for Room Card in Dashboard when there is more than 4 avatars selected
        numExcess ?   
            <Avatar sx={{ width: 56, height: 56, color: (theme) => theme.palette.midnight[60], fontWeight: 600 }} >{numExcess}</Avatar>
        : 
        
        // normal avatar
        <Avatar sx={{ width: 56, height: 56 }} alt={avatarContent} src="/static/images/avatar/1.jpg"/>
    )
}