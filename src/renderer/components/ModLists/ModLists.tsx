import { Accordion, AccordionDetails, AccordionSummary, Box, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getMods } from '../../redux/slices/main.slice';
import VirtualModList from './VirtualModList';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ConstructionIcon from '@mui/icons-material/Construction';
import PublicIcon from '@mui/icons-material/Public';
import FolderIcon from '@mui/icons-material/Folder';

const ModLists = () => {
    const allMods = useSelector(getMods);
    const steamMods = allMods['workshop'];
    const numSteam = useMemo(
        () => (typeof steamMods !== 'string' && steamMods !== undefined ? Object.keys(steamMods).length : 0),
        [steamMods],
    );

    const localMods = allMods['local'];
    const numLocal = useMemo(
        () => (typeof localMods !== 'string' && localMods !== undefined ? Object.keys(localMods).length : 0),
        [localMods],
    );

    return (
        <Box maxHeight={800} height={800} sx={{ overflowY: 'auto' }}>
            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <PublicIcon />
                        <span>Core</span>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    {typeof steamMods !== 'string' && steamMods !== undefined ? (
                        <VirtualModList mods={steamMods} />
                    ) : (
                        <></>
                    )}
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ConstructionIcon />
                        <span>Steam Workshop ({numSteam})</span>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    {typeof steamMods !== 'string' && steamMods !== undefined ? (
                        <VirtualModList mods={steamMods} />
                    ) : (
                        <></>
                    )}
                </AccordionDetails>
            </Accordion>
            <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <FolderIcon />
                        <span>Local Files ({numLocal})</span>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    {typeof localMods !== 'string' && localMods !== undefined ? (
                        <VirtualModList mods={localMods} />
                    ) : (
                        <></>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default ModLists;
