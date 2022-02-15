import { Button, Tooltip } from '@mui/material';
import React from 'react';

const OpenIcon = ({ link, title, icon }: { link: string; title: string; icon: JSX.Element }) => {
    return (
        <Tooltip title={title}>
            <Button onClick={() => window.api.createProcess(link)}>{icon}</Button>
        </Tooltip>
    );
};

export default OpenIcon;
