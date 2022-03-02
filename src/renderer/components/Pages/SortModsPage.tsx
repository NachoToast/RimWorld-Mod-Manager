import { Grid } from '@mui/material';
import React from 'react';
import ListsDashboard from '../ListsDashboard';
import SavedLists from '../SavedLists';
import ActiveModList from '../ModLists/ActiveModList';
import ModPreview from '../ModPreview';

const SortModsPage = () => {
    return (
        <Grid container spacing={2}>
            <Grid item container xs={4}>
                <Grid item xs={12}>
                    <ListsDashboard />
                </Grid>
                <Grid item xs={12}>
                    <SavedLists />
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <ModPreview />
            </Grid>
            <Grid item xs={4}>
                <ActiveModList />
            </Grid>
        </Grid>
    );
};

export default SortModsPage;
