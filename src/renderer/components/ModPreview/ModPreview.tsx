import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentMod } from '../../redux/slices/main.slice';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { Mod, ModSource } from '../../../types/ModFiles';

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

    return (
        <Box height={800} sx={{ overflowY: 'auto' }}>
            <Typography variant="h6">{currentMod.name}</Typography>
            <Stack direction="column">
                {Object.keys(currentMod).map((key, index) => {
                    const k = key as keyof Mod<ModSource>;
                    return (
                        <span key={index}>
                            {key}: {JSON.stringify(currentMod[k], undefined, 4)}
                        </span>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default ModPreview;
