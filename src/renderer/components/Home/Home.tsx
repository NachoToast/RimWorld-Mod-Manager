import { Button, Stack, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddModsPage from './AddModsPage';
import SortModsPage from './SortModsPage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
    // true = add page, false = sort page
    const [sortMode, setSortMode] = useState<boolean>(false);

    return (
        <>
            <div id="rmm-header">
                <Typography variant="h2" textAlign="center">
                    RimWorld Mod Manager
                </Typography>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                    <Tooltip title={sortMode ? 'Go back to adding/removing mods' : 'Go to sorting page'}>
                        <Button onClick={() => setSortMode(!sortMode)}>
                            {sortMode ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                        </Button>
                    </Tooltip>
                    <Typography variant="subtitle1" textAlign="center" sx={{ width: '301px' }}>
                        {sortMode ? (
                            <span>Save, load, and sort modlists.</span>
                        ) : (
                            <span>Add and remove mods from your modlist.</span>
                        )}
                    </Typography>
                </Stack>
            </div>
            {sortMode ? <SortModsPage /> : <AddModsPage />}
        </>
    );
};

export default Home;
