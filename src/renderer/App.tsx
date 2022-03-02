import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Home from './components/Home';
import SettingsButton from './components/Buttons/SettingsButton';
import SettingsPage from './components/Pages/SettingsPage/SettingsPage';
import CurrentlySelected from './components/Util/CurrentlySelected';
import TopLeftBox from './components/Util/TopLeftBox';
import VersionLabel from './components/Util/VersionLabel';
import { getSettingsOpen, initialLoad } from './redux/slices/main';

const App = () => {
    const dispatch = useDispatch();
    const settingsOpen = useSelector(getSettingsOpen);

    useEffect(() => {
        dispatch(initialLoad());
    }, [dispatch]);

    return (
        <Container sx={{ backgroundColor: '#272727', minHeight: '100vh' }} maxWidth={false}>
            <SettingsButton />
            <TopLeftBox>
                <VersionLabel />
                <CurrentlySelected />
            </TopLeftBox>
            {settingsOpen ? <SettingsPage /> : <Home />}
        </Container>
    );
};

export default App;
