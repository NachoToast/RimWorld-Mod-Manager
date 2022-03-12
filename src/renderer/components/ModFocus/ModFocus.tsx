import { Fade, Box } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFocussedMod } from '../../redux/slices/main';

const ModFocus = () => {
    const mod = useSelector(getFocussedMod);

    return (
        <Box>
            <Fade in={!!mod}>
                <span>{mod?.name}</span>
            </Fade>
        </Box>
    );
};

export default ModFocus;
