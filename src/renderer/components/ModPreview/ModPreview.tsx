import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentMod } from '../../redux/slices/main.slice';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';

const ModPreview = () => {
    const currentMod = useSelector(getCurrentMod);

    if (!currentMod)
        return (
            <Stack
                sx={{
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                spacing={1}
            >
                <PlagiarismIcon color="disabled" sx={{ fontSize: '64px' }} />
                <Typography variant="h5" color="gray">
                    Select a mod to preview
                </Typography>
            </Stack>
        );

    return <div>ModPreview</div>;
};

export default ModPreview;
