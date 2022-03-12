import { Container } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import { loadModsConfig } from './redux/slices/listManager';
import { loadAllMods } from './redux/slices/modLibrary';
import BrowsePage from './components/Pages/BrowsePage';
import SortPage from './components/Pages/SortPage';
import SettingsPage from './components/Pages/SettingsPage';
import { getPage, Pages } from './redux/slices/main';
import ListsPage from './components/Pages/ListsPage';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadAllMods());
        dispatch(loadModsConfig());
    }, [dispatch]);

    const page = useSelector(getPage);

    const content = useMemo<JSX.Element>(() => {
        switch (page) {
            case Pages.Browse:
                return <BrowsePage />;
            case Pages.Sort:
                return <SortPage />;
            case Pages.Settings:
                return <SettingsPage />;
            case Pages.Lists:
                return <ListsPage />;
        }
    }, [page]);

    return (
        <Container
            sx={{ backgroundColor: '#272727', height: '100vh', display: 'flex', flexFlow: 'column nowrap' }}
            maxWidth={false}
            style={{ paddingLeft: 0, paddingRight: 0 }}
        >
            {content}
            <Navbar />
        </Container>
    );
};

export default App;
