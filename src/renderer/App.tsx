import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Home from './components/Home/Home';
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
        <Container sx={{ backgroundColor: '#272727', height: '100%' }} maxWidth={false}>
            <SettingsButton />
            <VersionLabel />
            {settingsOpen ? <SettingsPage /> : <Home />}
        </Container>
    );
};

export default App;
