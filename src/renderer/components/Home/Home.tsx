import { Button, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import AddModsPage from '../Pages/AddModsPage';
import SortModsPage from '../Pages/SortModsPage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch, useSelector } from 'react-redux';
import { getPage, setPage } from '../../redux/slices/main';

const Home = () => {
    const dispatch = useDispatch();
    const page = useSelector(getPage);

    return (
        <>
            <div id="rmm-header">
                <Typography variant="h2" textAlign="center">
                    RimWorld Mod Manager
                </Typography>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                    <Tooltip title={page === 'sort' ? 'Go back to adding/removing mods' : 'Go to sorting page'}>
                        <Button onClick={() => dispatch(setPage(page === 'sort' ? 'add' : 'sort'))}>
                            {page === 'sort' ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                        </Button>
                    </Tooltip>
                    <Typography variant="subtitle1" textAlign="center" sx={{ width: '301px' }}>
                        {page === 'sort' ? (
                            <span>Save, load, and sort modlists.</span>
                        ) : (
                            <span>Add and remove mods from your modlist.</span>
                        )}
                    </Typography>
                </Stack>
            </div>
            {page === 'sort' ? <SortModsPage /> : <AddModsPage />}
        </>
    );
};

export default Home;
