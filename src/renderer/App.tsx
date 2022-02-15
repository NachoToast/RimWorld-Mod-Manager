import { Container, Grid, Grow, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActiveModList from './components/ModLists/ActiveModList';
import ModLists from './components/ModLists/ModLists';
import ModPreview from './components/ModPreview/ModPreview';
import SettingsButton from './components/Settings/SettingsButton';
import SettingsPage from './components/Settings/SettingsPage';
import VersionLabel from './components/Util/VersionLabel';
import { getSettingsOpen, initialLoad } from './redux/slices/main.slice';

const App = () => {
    const dispatch = useDispatch();
    const settingsOpen = useSelector(getSettingsOpen);

    useEffect(() => {
        dispatch(initialLoad());
    }, [dispatch]);

    return (
        <Container sx={{ backgroundColor: '#272727' }} maxWidth={false}>
            <VersionLabel />
            <SettingsButton />
            {settingsOpen && <SettingsPage />}
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
        </Container>
    );
};

export default App;
