import { Container, Grid, Grow, Typography } from '@mui/material';
import React from 'react';
import ActiveModList from '../ModLists/ActiveModList';
import ModLists from '../ModLists/ModLists';
import ModPreview from '../ModPreview/ModPreview';

const Home = () => {
    return (
        <>
            <Grow in>
                <Typography variant="h2" textAlign="center" gutterBottom>
                    RimWorld Mod Manager
                </Typography>
            </Grow>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4}>
                    <ModLists />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <ModPreview />
                </Grid>
                <Grid item xs={12} lg={2}>
                    <ActiveModList />
                </Grid>
            </Grid>
        </>
    );
};

export default Home;
