import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useRimWorldVersion from '../../../hooks/useRimWorldVersion';
import { getConfig } from '../../../redux/slices/main';
import { getModList, removeFromModList, addToModList } from '../../../redux/slices/modManager';
import { Mod, ModSource } from '../../../../types/ModFiles';
import { Stack, Tooltip, Button } from '@mui/material';
import OpenInFolderButton from '../../Buttons/OpenInFolderButton';
import OpenLinkButton from '../../Buttons/OpenLinkButton';
import ViewRawButton from '../../Buttons/ViewRawButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ButtonBarProps {
    mod: Mod<ModSource>;
    handleToggleRawMode: (e: React.MouseEvent) => void;
    rawMode: boolean;
}

const ButtonBar = ({ mod, rawMode, handleToggleRawMode }: ButtonBarProps) => {
    const dispatch = useDispatch();
    const config = useSelector(getConfig);
    const modList = useSelector(getModList);
    const version = useRimWorldVersion();

    const isInModList = useMemo(() => !!modList.lookup[mod.packageId.toLowerCase()], [mod.packageId, modList.lookup]);

    const toggleInList = useCallback(() => {
        if (isInModList) dispatch(removeFromModList([mod.packageId]));
        else dispatch(addToModList({ packageIds: [mod.packageId], version }));
    }, [dispatch, isInModList, mod.packageId, version]);

    return (
        <Stack direction="row">
            {mod.url && <OpenLinkButton link={mod.url} />}
            {mod.steamWorkshopURL && <OpenLinkButton link={mod.steamWorkshopURL} />}
            <OpenInFolderButton title="Open mod folder" link={mod.folderPath} />
            {config.viewRawButtonInPreview && <ViewRawButton callback={handleToggleRawMode} open={rawMode} />}
            <Tooltip title={isInModList ? 'Remove' : 'Add'}>
                <Button onClick={toggleInList}>{isInModList ? <RemoveIcon /> : <AddIcon />}</Button>
            </Tooltip>
        </Stack>
    );
};

export default ButtonBar;
