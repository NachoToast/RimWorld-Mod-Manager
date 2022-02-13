import { Container, Grow, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModSource } from '../types/ModFiles';
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
            {settingsOpen && <SettingsPage />}
            <SettingsButton />
            <Grow in>
                <Typography variant="h2" textAlign="center">
                    RimWorld Mod Manager
                </Typography>
            </Grow>
        </Container>
    );
};

export default App;
