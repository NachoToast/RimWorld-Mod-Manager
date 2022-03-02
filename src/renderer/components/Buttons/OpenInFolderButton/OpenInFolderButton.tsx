import { Button, Tooltip } from '@mui/material';
import React from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const OpenIcon = ({ link, title }: { link: string; title: string }) => {
    return (
        <Tooltip title={title}>
            <Button onClick={() => window.api.createProcess(link)}>
                <FolderOpenIcon />
            </Button>
        </Tooltip>
    );
};

export default OpenIcon;
