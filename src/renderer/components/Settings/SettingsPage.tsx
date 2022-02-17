import { Container, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilePaths, getModOverrides, getSettingsOpen, handleSettingsClose } from '../../redux/slices/main.slice';
import FilePath from './FilePaths';
import ModSourceOverrideTable from './ModSourceOverrideTable';
import VersionOverride from './VersionOverride';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const oldFilePaths = useSelector(getFilePaths);
    const oldModOverrides = useSelector(getModOverrides);

    useEffect(() => {
        return () => {
            dispatch(handleSettingsClose({ oldFilePaths, oldModOverrides }));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <>
            <Typography variant="h2" textAlign="center" gutterBottom>
                Settings
            </Typography>
            <Stack spacing={4} divider={<Divider flexItem />}>
                <FilePath />
                <VersionOverride />
                <ModSourceOverrideTable />
            </Stack>
        </>
    );
};

export default SettingsPage;
