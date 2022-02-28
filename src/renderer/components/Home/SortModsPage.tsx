import { Grid } from '@mui/material';
import React from 'react';
import Dashboard from '../ListOfLists/Dashboard';
import ListOfLists from '../ListOfLists/ListOfLists';
import ActiveModList from '../ModLists/ActiveModList';
import ModPreview from '../ModPreview/ModPreview';

const SortModsPage = () => {
    return (
        <Grid container spacing={2}>
            <Grid item container xs={4}>
                <Grid item xs={12}>
                    <Dashboard />
                </Grid>
                <Grid item xs={12}>
                    <ListOfLists />
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
