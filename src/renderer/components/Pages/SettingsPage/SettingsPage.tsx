import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilePaths, getModOverrides, handleSettingsClose } from '../../../redux/slices/main';
import DeveloperSettings from './DeveloperSettings';
import FilePath from './FilePaths/FilePaths';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModSourceOverrides from './ModSourceOverrides';
import VersionOverride from './VersionOverrides';

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
            <Typography variant="h2" textAlign="center">
                Settings
            </Typography>
            <Typography textAlign="center" gutterBottom color="gray">
                RimWorld Mod Manager {window.api.version}
            </Typography>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">File Paths</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FilePath />
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">RimWorld Version</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <VersionOverride />
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">Mod Source Overrides</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ModSourceOverrides />
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">Developer Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DeveloperSettings />
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default SettingsPage;
