import { Container, Grid, Grow, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModSource } from '../types/ModFiles';
import ModLists from './components/ModLists/ModLists';
import ModPreview from './components/ModPreview/ModPreview';
import SettingsButton from './components/Settings/SettingsButton';
import SettingsPage from './components/Settings/SettingsPage';
import { getMods, getSettingsOpen, loadMods } from './redux/slices/main.slice';

const App = () => {
    const dispatch = useDispatch();
    const settingsOpen = useSelector(getSettingsOpen);
    const mods = useSelector(getMods);

    useEffect(() => {
        for (const key of Object.keys(mods) as ModSource[]) {
            if (mods[key] === undefined) {
                dispatch(loadMods(key));
            }
        }
    }, [dispatch, mods]);

    return (
        <Container sx={{ backgroundColor: '#272727' }} maxWidth={false}>
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
                <Grid item xs={12} md={6} lg={4}>
                    <ModPreview />
                </Grid>
                <Grid item xs={12} lg={4} sx={{ flexGrow: 1, border: 'solid 1px pink' }}>
                    <Typography>Active List</Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default App;
