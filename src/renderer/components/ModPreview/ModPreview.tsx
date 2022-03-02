import { Stack, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig, getCurrentMod, setCurrentMod } from '../../redux/slices/main';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import ModDescription from './ModDescription';
import { getModLibrary } from '../../redux/slices/modManager';
import './ModPreview.css';
import useRemainingSize from '../../hooks/useRemainingSize';
import ButtonBar from './ButtonBar';

const ModPreview = () => {
    const dispatch = useDispatch();
    const mod = useSelector(getCurrentMod);
    const modLibrary = useSelector(getModLibrary);
    const config = useSelector(getConfig);

    const height = useRemainingSize() - 50;

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
                <Stack height={height} sx={{ overflowY: 'auto' }} {...dragEventHandlers}>
                    <pre>{JSON.stringify(mod, undefined, 4)}</pre>
                    <ButtonBar mod={mod} handleToggleRawMode={handleToggleRawMode} rawMode={true} />
                </Stack>
            </div>
        );

    return (
        <div className={`previewContainer${dragged ? ' hovered' : ''}`}>
            <Stack height={height} sx={{ overflowY: 'auto' }} {...dragEventHandlers}>
                <ModDescription mod={mod} />
                <ButtonBar mod={mod} handleToggleRawMode={handleToggleRawMode} rawMode={false} />
            </Stack>
        </div>
    );
};

export default ModPreview;
