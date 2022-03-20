import { Divider, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Mod, ModSource, PackageId } from '../../../../../types/ModFiles';
import { getFilteredModLibrary } from '../../../../redux/slices/modLibrary';
import Searchbox from '../../../Searchbox';
import ModRow from '../ModRow';

const AllModsList = ({ activeList }: { activeList: Set<PackageId> }) => {
    const modLibrary = useSelector(getFilteredModLibrary);

    const modsToShow = useMemo<Mod<ModSource>[]>(() => {
        return Object.values(modLibrary).filter(({ packageId }) => !activeList.has(packageId.toLowerCase()));
    }, [activeList, modLibrary]);

    return (
        <>
            <Stack sx={{ width: '100%' }}>
                <Typography textAlign="center" variant="h4" sx={{ mt: 1 }}>
                    All Mods
                </Typography>
                <Searchbox placeholder="Search" hideEnterHint sx={{ ml: 1 }} />
            </Stack>
            <Stack divider={<Divider flexItem />} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {modsToShow.map((mod) => (
                    <ModRow key={mod.packageId} mod={mod} packageId={mod.packageId} />
                ))}
            </Stack>
        </>
    );
};

export default AllModsList;
