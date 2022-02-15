import { Accordion, AccordionDetails, AccordionSummary, Box, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import VirtualModList from './VirtualModList';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ConstructionIcon from '@mui/icons-material/Construction';
import PublicIcon from '@mui/icons-material/Public';
import FolderIcon from '@mui/icons-material/Folder';
import { Mod, ModSource } from '../../../types/ModFiles';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getModLibrary } from '../../../renderer/redux/slices/modManager.slice';

interface ModSourceGroup<T extends ModSource> {
    mods: Mod<T>[];
    title: string;
    icon: JSX.Element;
}

/** List of mods grouped by source (workshop, local, core), and ordered by file name. */
const ModLists = () => {
    const modLibrary = useSelector(getModLibrary);

    const modsGroupedBySource = useMemo<
        [ModSourceGroup<'core'>, ModSourceGroup<'local'>, ModSourceGroup<'workshop'>]
    >(() => {
        const coreMods: ModSourceGroup<'core'> = {
            mods: [],
            title: 'Core',
            icon: <PublicIcon />,
        };
        const localMods: ModSourceGroup<'local'> = {
            mods: [],
            title: 'Local Files',
            icon: <FolderIcon />,
        };
        const workshopMods: ModSourceGroup<'workshop'> = {
            mods: [],
            title: 'Steam Workshop',
            icon: <ConstructionIcon />,
        };

        const map: { [K in ModSource]: ModSourceGroup<K> } = {
            core: coreMods,
            local: localMods,
            workshop: workshopMods,
        };

        for (const packageId in modLibrary) {
            const mod = modLibrary[packageId];
            map[mod.source].mods.push(mod);
        }

        return [coreMods, localMods, workshopMods];
    }, [modLibrary]);

    return (
        <Box height={800} sx={{ overflowY: 'auto' }}>
            <Stack direction="row">
                <FilterAltIcon />
            </Stack>
            {modsGroupedBySource.map(({ icon, title, mods }, index) => (
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
            ))}
        </Box>
    );
};

export default ModLists;
