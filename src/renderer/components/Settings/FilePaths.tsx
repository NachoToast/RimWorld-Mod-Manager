import { Stack, Fade, Tooltip, Button, Typography, TextField, Zoom } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pathDefaults } from '../../constants/constants';
import ConstructionIcon from '@mui/icons-material/Construction';
import FolderIcon from '@mui/icons-material/Folder';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { getFilePaths, setSettingsOpen, setFilePath } from '../../redux/slices/main.slice';
import { FilePaths } from '../../../types/ModFiles';
import { Box } from '@mui/system';

const PathDialogue = ({ type }: { type: FilePaths }) => {
    const dispatch = useDispatch();
    const filePaths = useSelector(getFilePaths);

    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const closeOnEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                dispatch(setSettingsOpen(false));
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => {
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [dispatch]);

    const [title, icon] = useMemo(() => {
        switch (type) {
            case 'local':
                return ['Local Files', <FolderIcon />];
            case 'workshop':
                return ['Steam Workshop', <ConstructionIcon />];
            case 'modlist':
                return ['Modlist Config', <FormatListNumberedIcon />];
        }
    }, [type]);

    const canReset = useMemo(() => filePaths[type] !== pathDefaults[type], [filePaths, type]);

    const handleChange = (e: React.FormEvent) => {
        e.preventDefault();
        const { value } = e.target as HTMLTextAreaElement;
        dispatch(setFilePath({ newPath: value, target: type }));
    };

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setFilePath({ newPath: pathDefaults[type], target: type }));
    };

    const handleOpenInFolder = (e: React.FormEvent) => {
        e.preventDefault();
        window.api.createProcess(filePaths[type]);
    };

    return (
        <Box
            sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <TextField
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                onInput={handleChange}
                label={
                    <Stack spacing={1} direction="row" alignItems="center">
                        {icon}
                        <span>{title}</span>
                    </Stack>
                }
                variant="standard"
                fullWidth
                value={filePaths[type]}
            />
            <Fade in={isHovered}>
                <Stack direction="row-reverse">
                    <Zoom in={canReset}>
                        <Tooltip title="Reset to Default">
                            <Button onClick={handleReset}>
                                <RestartAltIcon color="error" />
                            </Button>
                        </Tooltip>
                    </Zoom>
                    <Tooltip title="Open in Folder">
                        <Button onClick={handleOpenInFolder}>
                            <FolderOpenIcon />
                        </Button>
                    </Tooltip>
                </Stack>
            </Fade>
        </Box>
    );
};

const FilePaths = () => {
    const filePaths = useSelector(getFilePaths);

    return (
        <Stack spacing={2}>
            <Typography variant="h5">File Paths</Typography>
            {Object.keys(filePaths).map((key, i) => (
                <PathDialogue type={key as FilePaths} key={i} />
            ))}
        </Stack>
    );
};

export default FilePaths;
