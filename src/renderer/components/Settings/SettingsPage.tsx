import { Container, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import FilePath from './FilePaths';

const SettingsPage = () => {
    return (
        <Container sx={{ position: 'fixed', backgroundColor: '#272727', height: '100%', zIndex: '1' }} maxWidth={false}>
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
