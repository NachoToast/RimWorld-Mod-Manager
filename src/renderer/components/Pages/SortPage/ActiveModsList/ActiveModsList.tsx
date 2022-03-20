import { Divider, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import CustomList from '../../../../../types/CustomList';
import { Mod, PackageId } from '../../../../../types/ModFiles';
import { getFilteredModLibrary } from '../../../../redux/slices/modLibrary';
import ModRow from '../ModRow';

const ActiveModsList = ({ activeList }: { activeList: CustomList }) => {
    const modLibrary = useSelector(getFilteredModLibrary);

    const modsToShow = useMemo<(Mod | PackageId)[]>(() => {
        return activeList.mods.map((id) => (modLibrary[id.toLowerCase()] as Mod | undefined) || id);
    }, [activeList, modLibrary]);

    return (
        <>
            <Stack sx={{ width: '100%' }}>
                <Typography textAlign="center" variant="h4" sx={{ mt: 1 }}>
                    {activeList.name}
                </Typography>
            </Stack>
            <Stack divider={<Divider flexItem />} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {modsToShow.map((mod) => {
                    if (typeof mod !== 'string') {
                        return <ModRow key={mod.packageId} mod={mod} packageId={mod.packageId} isInModList />;
                    } else return <ModRow key={mod} packageId={mod} isInModList />;
                })}
            </Stack>
        </>
    );
};

export default ActiveModsList;
