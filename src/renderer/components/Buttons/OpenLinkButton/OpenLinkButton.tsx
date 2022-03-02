import React, { useEffect, useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import ShareIcon from '@mui/icons-material/Share';
import ConstructionIcon from '@mui/icons-material/Construction';
import ForumIcon from '@mui/icons-material/Forum';
import { Button, Tooltip } from '@mui/material';
import useSteamLinkOverriding from '../../../hooks/useSteamLinkOverriding';

const LinkIcon = ({ link }: { link: string }) => {
    const [[icon, title], setIcon] = useState<[icon: JSX.Element, title: string | JSX.Element]>([<ShareIcon />, link]);

    const finalLink = useSteamLinkOverriding(link);

    useEffect(() => {
        if (finalLink.includes('steam')) {
            setIcon([<ConstructionIcon />, 'Steam Page']);
        } else if (finalLink.includes('github')) {
            setIcon([<GitHubIcon />, 'GitHub Repository']);
        } else if (finalLink.includes('ludeon')) {
            setIcon([<ForumIcon />, 'Ludeon Forums Post']);
        }
    }, [finalLink]);

    return (
        <Tooltip title={title}>
            <Button href={finalLink} target="_blank">
                {icon}
            </Button>
        </Tooltip>
    );
};

export default LinkIcon;
