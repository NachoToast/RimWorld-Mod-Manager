import { Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import './NotSelectedOverlay.css';

interface NotSelectedOverlayProps {
    text: string;
    hoverEvents?: true;
    actionElement?: JSX.Element;
    customIcon?: JSX.Element;
}

const NotSelectedOverlay = (props: NotSelectedOverlayProps) => {
    const { text, actionElement, customIcon } = props;

    const [isDraggedOver] = useState<boolean>(false);

    return (
        <div className={`previewContainer${isDraggedOver ? ' hovered' : ''}`}>
            <Stack sx={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }} spacing={1}>
                {customIcon || <PlagiarismIcon color="disabled" sx={{ fontSize: '64px', pointerEvents: 'none' }} />}
                <Typography variant="h5" color="gray" sx={{ pointerEvents: 'none' }}>
                    {text}
                </Typography>
                {actionElement}
            </Stack>
        </div>
    );
};

export default NotSelectedOverlay;
