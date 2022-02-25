import { Grid, Typography } from '@mui/material';
import React from 'react';
import ActiveModList from '../ModLists/ActiveModList';
import ModPreview from '../ModPreview/ModPreview';

const SortModsPage = () => {
    return (
        <Grid container spacing={2}>
            <Grid item container xs={4}>
                <Grid item xs={12} sx={{ border: 'solid 1px red' }}>
                    <Typography>dashboard</Typography>
                </Grid>
                <Grid item xs={12} sx={{ border: 'solid 1px aquamarine' }}>
                    <Typography>load/save lists</Typography>
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <ModPreview />
            </Grid>
            <Grid item xs={4} sx={{ border: 'solid 1px white' }}>
                <ActiveModList />
            </Grid>
        </Grid>
    );
};

export default SortModsPage;
