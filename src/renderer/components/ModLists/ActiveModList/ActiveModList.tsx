import { Button, Collapse, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { addToModList, clearModList, getModList } from '../../../redux/slices/modManager';
import { getCurrentList, modifyList } from '../../../redux/slices/listManager';
import { ModSource, Mod } from '../../../../types/ModFiles';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import ModRow from '../ModRow';
import useRimWorldVersion from '../../../hooks/useRimWorldVersion';
import useRemainingSize from '../../../hooks/useRemainingSize';

/** A list of the mods in the currently selected mod list, even if they don't exist in the library. */
const ActiveModList = () => {
    const dispatch = useDispatch();
    const list = useSelector(getModList);
    const savedList = useSelector(getCurrentList);

    const version = useRimWorldVersion();
    const { packageIds, lookup } = list;

    const maxHeight = useRemainingSize();

    const height = useMemo(() => Math.min(maxHeight - 50, 50 * packageIds.length), [maxHeight, packageIds.length]);

    const row = (props: { index: number; style: React.CSSProperties }) => {
        const mod: Mod<ModSource> | undefined = lookup[packageIds[props.index]];

        return <ModRow {...props} mod={mod || packageIds[props.index]} />;
    };

    const isUnsaved = useMemo<boolean>(() => {
        return savedList.mods.toString() !== packageIds.toString();
    }, [packageIds, savedList.mods]);

    const handleSaveList = useCallback(() => {
        dispatch(modifyList({ oldListName: savedList.name, newList: { ...savedList, mods: packageIds } }));
    }, [dispatch, packageIds, savedList]);

    const handleResetList = useCallback(() => {
        dispatch(clearModList());
        dispatch(addToModList({ packageIds: savedList.mods, version: version }));
    }, [dispatch, savedList.mods, version]);

    return (
        <Stack height={maxHeight} sx={{ overflowY: 'auto' }}>
            <Typography textAlign="center" variant="h6">
                Active Mods ({packageIds.length})
            </Typography>
            <Stack direction="row" justifyContent="space-evenly">
                <Collapse in={isUnsaved}>
                    <Tooltip title="Reset Changes">
                        <Button onClick={handleResetList}>
                            <RestartAltIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Save Changes">
                        <Button onClick={handleSaveList}>
                            <SaveIcon />
                        </Button>
                    </Tooltip>
                </Collapse>
            </Stack>
            <FixedSizeList height={height} width="100%" itemSize={46} itemCount={packageIds.length} overscanCount={5}>
                {row}
            </FixedSizeList>
        </Stack>
    );
};

export default ActiveModList;