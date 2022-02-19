import { Accordion, AccordionDetails, AccordionSummary, Box, Stack } from '@mui/material';
import React from 'react';
import VirtualModList from './VirtualModList';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Toolbar from '../Toolbar/Toolbar';
import useModGrouping from '../Util/useModGouping';

const ModLists = () => {
    const groupedMods = useModGrouping();

    return (
        <Box height={800} sx={{ overflowY: 'auto', scrollbarGutter: 'stable' }}>
            <Toolbar />
            {groupedMods.length === 1 ? (
                <VirtualModList mods={groupedMods[0].mods} />
            ) : (
                groupedMods.map(({ icon, title, mods }, index) => (
                    <Accordion disableGutters key={index}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {icon}
                                <span>
                                    {title} ({mods.length})
                                </span>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <VirtualModList mods={mods} />
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Box>
    );
};

export default ModLists;
