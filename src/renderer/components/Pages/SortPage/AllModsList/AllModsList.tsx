import { Divider, Stack, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mod, ModSource, PackageId } from '../../../../../types/ModFiles';
import { setFocussedMod } from '../../../../redux/slices/main';
import { getFilteredModLibrary } from '../../../../redux/slices/modLibrary';
import Searchbox from '../../../Searchbox';

const AllModsList = ({ activeList }: { activeList: Set<PackageId> }) => {
    const dispatch = useDispatch();
    const modLibrary = useSelector(getFilteredModLibrary);

    const modsToShow = useMemo<Mod<ModSource>[]>(() => {
        return Object.values(modLibrary).filter(({ packageId }) => !activeList.has(packageId.toLowerCase()));
    }, [activeList, modLibrary]);

    const selectMod = useCallback(
        (mod: Mod<ModSource>) => {
            return () => dispatch(setFocussedMod(mod));
        },
        [dispatch],
    );

    return (
        <>
            <Stack sx={{ width: '100%' }}>
                <Typography textAlign="center" variant="h4" sx={{ mt: 1 }}>
                    All Mods
                </Typography>
                <Searchbox placeholder="Search" hideEnterHint sx={{ ml: 1 }} />
            </Stack>
            <Stack divider={<Divider flexItem />} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {modsToShow.map((mod, index) => (
                    <span key={index} className="modRow noSelect" onClick={selectMod(mod)}>
                        {mod.name}
                    </span>
                ))}
            </Stack>
        </>
    );
};

export default AllModsList;
