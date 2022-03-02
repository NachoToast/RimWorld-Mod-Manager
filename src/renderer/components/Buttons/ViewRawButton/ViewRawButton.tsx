import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import { Button, Tooltip } from '@mui/material';

const JsonIcon = ({ open, callback }: { open: boolean; callback: (e: React.MouseEvent) => void }) => {
    return (
        <Tooltip title={open ? 'View Formatted' : 'View Raw'}>
            <Button onClick={callback}>
                <CodeIcon />
            </Button>
        </Tooltip>
    );
};

export default JsonIcon;
