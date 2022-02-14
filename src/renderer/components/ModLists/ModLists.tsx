import { Accordion, AccordionDetails, AccordionSummary, Box, Stack } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getMods } from '../../redux/slices/main.slice';
import VirtualModList from './VirtualModList';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ConstructionIcon from '@mui/icons-material/Construction';
import PublicIcon from '@mui/icons-material/Public';
import FolderIcon from '@mui/icons-material/Folder';
import { ModSource } from '../../../types/ModFiles';

const sourceMap: { [K in ModSource]: [title: string, icon: JSX.Element] } = {
    core: ['Core', <PublicIcon />],
    local: ['Local Files', <FolderIcon />],
    workshop: ['Steam Workshop', <ConstructionIcon />],
};

const ModLists = () => {
    const allMods = useSelector(getMods);

    return (
        <Box height={800} sx={{ overflowY: 'auto' }}>
            {(Object.keys(allMods).reverse() as ModSource[]).map((listName, index) => {
                const mods = allMods[listName];
                if (typeof mods === 'string') {
                    return <div key={index}>{mods}</div>;
                } else if (mods === undefined) {
                    return <div key={index}></div>;
                } else {
                    const numMods = Object.keys(mods).length;
                    const [title, icon] = sourceMap[listName];
                    return (
                        <Accordion disableGutters key={index}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {icon}
                                    <span>
                                        {title} ({numMods})
                                    </span>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VirtualModList mods={mods} />
                            </AccordionDetails>
                        </Accordion>
                    );
                }
            })}
        </Box>
    );
};

export default ModLists;
