import { Box } from '@mui/material';
import React from 'react';
import RawModList from './RawModList';
import Toolbar from './Toolbar';
import useModGrouping from '../../hooks/useModGouping';
import GroupedModList from './GroupedModList';
import useRemainingSize from '../../hooks/useRemainingSize';

/** List of all mods, regardless of whether they are active or not. */
const AllModsList = () => {
    const groupedMods = useModGrouping();

    const height = useRemainingSize();

    return (
        <Box height={height} sx={{ overflowY: 'auto', scrollbarGutter: 'stable' }}>
            <Toolbar />
            {groupedMods.length === 1 ? (
                <RawModList mods={groupedMods[0].mods} />
            ) : (
                groupedMods.map((props, index) => <GroupedModList {...props} key={index} />)
            )}
        </Box>
    );
};

export default AllModsList;
