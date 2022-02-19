import React, { useEffect, useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import ShareIcon from '@mui/icons-material/Share';
import ConstructionIcon from '@mui/icons-material/Construction';
import ForumIcon from '@mui/icons-material/Forum';
import { Button, Tooltip } from '@mui/material';

const LinkIcon = ({ link }: { link: string }) => {
    const [[icon, title], setIcon] = useState<[icon: JSX.Element, title: string | JSX.Element]>([<ShareIcon />, link]);

    useEffect(() => {
        if (link.includes('steam')) {
            setIcon([<ConstructionIcon />, 'Steam Page']);
        } else if (link.includes('github')) {
            setIcon([<GitHubIcon />, 'GitHub Repository']);
        } else if (link.includes('ludeon')) {
            setIcon([<ForumIcon />, 'Ludeon Forums Post']);
        }
    }, [link]);

    return (
        <Tooltip title={title}>
            <Button href={link} target="_blank" onClick={() => console.log(link)}>
                {icon}
            </Button>
        </Tooltip>
    );
};

export default LinkIcon;
