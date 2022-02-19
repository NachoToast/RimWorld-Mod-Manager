import React, { useEffect, useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import ShareIcon from '@mui/icons-material/Share';
import ConstructionIcon from '@mui/icons-material/Construction';
import ForumIcon from '@mui/icons-material/Forum';
import { Button, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { getConfig } from '../../redux/slices/config.slice';

const LinkIcon = ({ link }: { link: string }) => {
    const [[icon, title], setIcon] = useState<[icon: JSX.Element, title: string | JSX.Element]>([<ShareIcon />, link]);

    const { booleanDefaultOff: config } = useSelector(getConfig);

    const [overridenLink, setOverridenLink] = useState<string>('');

    useEffect(() => {
        if (link.includes('steam')) {
            setIcon([<ConstructionIcon />, 'Steam Page']);
        } else if (link.includes('github')) {
            setIcon([<GitHubIcon />, 'GitHub Repository']);
        } else if (link.includes('ludeon')) {
            setIcon([<ForumIcon />, 'Ludeon Forums Post']);
        }
    }, [link]);

    useEffect(() => {
        if (link.includes('steam')) {
            if (config.openWorkshopLinksInBrowser) {
                const id = link.split('/').at(-1);
                if (id) {
                    setOverridenLink(`https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`);
                }
            } else {
                setOverridenLink('');
            }
        }
    }, [config.openWorkshopLinksInBrowser, link]);

    return (
        <Tooltip title={title}>
            <Button href={overridenLink || link} target="_blank">
                {icon}
            </Button>
        </Tooltip>
    );
};

export default LinkIcon;
