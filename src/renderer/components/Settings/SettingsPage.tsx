import { Container, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getMods } from '../../redux/slices/main.slice';
import FilePaths from './FilePaths';

const SettingsPage = () => {
    const mods = useSelector(getMods);

    useEffect(() => {
        console.log(mods);
    }, [mods]);

    return (
        <Container sx={{ position: 'fixed', backgroundColor: '#272727', left: 0, minHeight: '100%' }} maxWidth={false}>
            <Typography variant="h2" textAlign="center" gutterBottom>
                Settings
            </Typography>
            <Stack spacing={4} divider={<Divider flexItem />}>
                <FilePaths />
                <Stack spacing={2}>
                    <Typography variant="h5">Another Option</Typography>
                </Stack>
            </Stack>
        </Container>
    );
};

export default SettingsPage;
