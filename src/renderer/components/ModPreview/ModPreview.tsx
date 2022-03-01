import { Button, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig, getCurrentMod, setCurrentMod } from '../../redux/slices/main.slice';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { Mod, ModSource } from '../../../types/ModFiles';
import LinkIcon from '../Util/LinkIcon';
import OpenIcon from '../Util/OpenIcon';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import JsonIcon from '../Util/JsonIcon';
import ModDescription from './ModDescription';
import { getModList, removeFromModList, addToModList, getModLibrary } from '../../redux/slices/modManager.slice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useRimWorldVersion from '../../hooks/useRimWorldVersion';
import './ModPreview.css';

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
            {config.viewRawButtonInPreview && <JsonIcon callback={handleToggleRawMode} open={rawMode} />}
            <Tooltip title={isInModList ? 'Remove' : 'Add'}>
                <Button onClick={toggleInList}>{isInModList ? <RemoveIcon /> : <AddIcon />}</Button>
            </Tooltip>
        </Stack>
    );
};

const ModPreview = () => {
    const dispatch = useDispatch();
    const mod = useSelector(getCurrentMod);
    const modLibrary = useSelector(getModLibrary);
    const config = useSelector(getConfig);

    const [rawMode, setRawMode] = useState<boolean>(config.showRawJsonByDefault);

    const handleToggleRawMode = () => {
        setRawMode(!rawMode);
    };

    const [dragged, setDragged] = useState<boolean>(false);

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            if (!dragged) setDragged(true);
        },
        [dragged],
    );

    const handleDragLeave = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            if (dragged) setDragged(false);
        },
        [dragged],
    );

    const handleDrop = (e: React.DragEvent) => {
        const packageId = e.dataTransfer.getData('text/plain');
        const mod = modLibrary[packageId.toLowerCase()];
        setDragged(false);
        dispatch(setCurrentMod(mod || null));
    };

    const dragEventHandlers = {
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
    };

    if (!mod)
        return (
            <div className={`previewContainer${dragged ? ' hovered' : ''}`}>
                <Stack
                    sx={{
                        height: '100%',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    spacing={1}
                    {...dragEventHandlers}
                >
                    <PlagiarismIcon color="disabled" sx={{ fontSize: '64px', pointerEvents: 'none' }} />
                    <Typography variant="h5" color="gray" sx={{ pointerEvents: 'none' }}>
                        Select a mod to preview
                    </Typography>
                </Stack>
            </div>
        );

    if (rawMode)
        return (
            <div className={`previewContainer${dragged ? ' hovered' : ''}`}>
                <Stack height={800} sx={{ overflowY: 'auto' }} {...dragEventHandlers}>
                    <pre>{JSON.stringify(mod, undefined, 4)}</pre>
                    <ButtonBar mod={mod} handleToggleRawMode={handleToggleRawMode} rawMode={true} />
                </Stack>
            </div>
        );

    return (
        <div className={`previewContainer${dragged ? ' hovered' : ''}`}>
            <Stack height={800} sx={{ overflowY: 'auto' }} {...dragEventHandlers}>
                <ModDescription mod={mod} />
                <ButtonBar mod={mod} handleToggleRawMode={handleToggleRawMode} rawMode={false} />
            </Stack>
        </div>
    );
};

export default ModPreview;
