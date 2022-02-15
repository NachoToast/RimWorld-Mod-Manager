import { Container, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkFilePathsChanged, getFilePaths } from '../../redux/slices/main.slice';
import FilePath from './FilePaths';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const filePaths = useSelector(getFilePaths);

    useEffect(() => {
        return () => {
            dispatch(checkFilePathsChanged(filePaths));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <Container
            sx={{ position: 'fixed', backgroundColor: '#272727', height: '100%', zIndex: '1', left: 0 }}
            maxWidth={false}
        >
            <Typography variant="h2" textAlign="center" gutterBottom>
                Settings
            </Typography>
            <Stack spacing={4} divider={<Divider flexItem />}>
                <FilePath />
                <Stack spacing={2}>
                    <Typography variant="h5">Another Option</Typography>
                </Stack>
            </Stack>
        </Container>
    );
};

export default SettingsPage;
