import { Button, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentMod } from '../../redux/slices/main.slice';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { Mod, ModSource } from '../../../types/ModFiles';
import LinkIcon from '../Util/LinkIcon';
import OpenIcon from '../Util/OpenIcon';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import JsonIcon from '../Util/JsonIcon';
import { ConfigOptions, getConfig } from '../../redux/slices/config.slice';
import ModDescription from './ModDescription';
import { getModList, removeFromModList, addToModList } from '../../redux/slices/modManager.slice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useRimWorldVersion from '../Util/useRimWorldVersion';

const ButtonBar = ({
    mod,
    rawMode,
    handleToggleRawMode,
}: {
    mod: Mod<ModSource>;
    handleToggleRawMode: (e: React.MouseEvent) => void;
    rawMode: boolean;
}) => {
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
            {mod.url && <LinkIcon link={mod.url} />}
            {mod.steamWorkshopURL && <LinkIcon link={mod.steamWorkshopURL} />}
            <OpenIcon icon={<FolderOpenIcon />} title="Open mod folder" link={mod.folderPath} />
            {config.booleanDefaultOff[ConfigOptions.ViewRawPreviewButton] && (
                <JsonIcon callback={handleToggleRawMode} open={rawMode} />
            )}
            <Tooltip title={isInModList ? 'Remove' : 'Add'}>
                <Button onClick={toggleInList}>{isInModList ? <RemoveIcon /> : <AddIcon />}</Button>
            </Tooltip>
        </Stack>
    );
};

const ModPreview = () => {
    const mod = useSelector(getCurrentMod);
    const config = useSelector(getConfig);

    const [rawMode, setRawMode] = useState<boolean>(config.booleanDefaultOff[ConfigOptions.RawJsonPreviewDefault]);

    const handleToggleRawMode = () => {
        setRawMode(!rawMode);
    };

    if (!mod)
        return (
            <Stack
                sx={{
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                spacing={1}
            >
                <PlagiarismIcon color="disabled" sx={{ fontSize: '64px' }} />
                <Typography variant="h5" color="gray">
                    Select a mod to preview
                </Typography>
            </Stack>
        );

    if (rawMode)
        return (
            <Stack height={800} sx={{ overflowY: 'auto' }}>
                <pre>{JSON.stringify(mod, undefined, 4)}</pre>
                <ButtonBar mod={mod} handleToggleRawMode={handleToggleRawMode} rawMode={true} />
            </Stack>
        );

    return (
        <Stack height={800} sx={{ overflowY: 'auto' }}>
            <ModDescription mod={mod} />
            <ButtonBar mod={mod} handleToggleRawMode={handleToggleRawMode} rawMode={false} />
        </Stack>
    );
};

export default ModPreview;
