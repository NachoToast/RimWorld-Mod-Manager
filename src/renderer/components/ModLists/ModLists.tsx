import { Box } from '@mui/material';
import React from 'react';
import VirtualModList from './VirtualModList';
import Toolbar from './Toolbar/Toolbar';
import useModGrouping from '../../hooks/useModGouping';
import SingleList from './SingleList';

const ModLists = () => {
    const groupedMods = useModGrouping();

    return (
        <Box height={800} sx={{ overflowY: 'auto', scrollbarGutter: 'stable' }}>
            <Toolbar />
            {groupedMods.length === 1 ? (
                <VirtualModList mods={groupedMods[0].mods} />
            ) : (
                groupedMods.map((props, index) => <SingleList {...props} key={index} />)
            )}
        </Box>
    );
};

export default ModLists;
