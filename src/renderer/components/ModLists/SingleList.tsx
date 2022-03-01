import { Accordion, AccordionDetails, AccordionSummary, Button, Fade, Stack, Tooltip } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { Mod, ModSource } from '../../../types/ModFiles';

import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch, useSelector } from 'react-redux';
import { addToModList, getModList, removeFromModList } from '../../redux/slices/modManager.slice';
import VirtualModList from './VirtualModList';
import useRimWorldVersion from '../../hooks/useRimWorldVersion';

interface ModListProps {
    icon: JSX.Element;
    title: string;
    mods: Mod<ModSource>[];
}

const SingleList = ({ icon, title, mods }: ModListProps) => {
    const dispatch = useDispatch();
    const modlist = useSelector(getModList);
    const version = useRimWorldVersion();

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const numActive = useMemo<number>(
        () => mods.filter((mod) => modlist.lookup[mod.packageId.toLocaleLowerCase()]).length,
        [modlist.lookup, mods],
    );

    const canRemoveAll = useMemo<boolean>(() => numActive > 0, [numActive]);
    const canAddAll = useMemo<boolean>(() => numActive < mods.length, [mods.length, numActive]);

    const removeAll = useCallback(() => {
        dispatch(removeFromModList(mods.map(({ packageId }) => packageId)));
    }, [dispatch, mods]);

    const addAll = useCallback(() => {
        dispatch(addToModList({ packageIds: mods.map(({ packageId }) => packageId), version }));
    }, [dispatch, mods, version]);

    return (
        <Accordion expanded={isExpanded} onChange={() => setIsExpanded(!isExpanded)} disableGutters>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {icon}
                    <span>
                        {title} ({numActive} / {mods.length})
                    </span>
                </Stack>
                <Fade in={isExpanded}>
                    <Stack sx={{ flexGrow: 1 }} direction="row" justifyContent="flex-end">
                        <Fade in={canRemoveAll}>
                            <Tooltip title="Remove all">
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeAll();
                                    }}
                                >
                                    <RemoveIcon />
                                </Button>
                            </Tooltip>
                        </Fade>
                        <Fade in={canAddAll}>
                            <Tooltip title="Add all">
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        addAll();
                                    }}
                                >
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </Fade>
                    </Stack>
                </Fade>
            </AccordionSummary>
            <AccordionDetails>
                <VirtualModList mods={mods} />
            </AccordionDetails>
        </Accordion>
    );
};

export default SingleList;
