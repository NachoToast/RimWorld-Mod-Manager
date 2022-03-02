import { Grid } from '@mui/material';
import React from 'react';
import ActiveModList from '../ModLists/ActiveModList';
import AllModsList from '../ModLists';
import ModPreview from '../ModPreview';

const AddModsPage = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
                <AllModsList />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
                <ModPreview />
            </Grid>
            <Grid item xs={12} lg={2}>
                <ActiveModList />
            </Grid>
        </Grid>
    );
};

export default AddModsPage;
