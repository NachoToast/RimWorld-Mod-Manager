import { Stack, Tooltip, Button, TextField, Slide } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pathDefaults } from '../../constants/constants';
import ConstructionIcon from '@mui/icons-material/Construction';
import FolderIcon from '@mui/icons-material/Folder';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PublicIcon from '@mui/icons-material/Public';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { getFilePaths, setSettingsOpen, setFilePath } from '../../redux/slices/main.slice';
import { FilePath } from '../../../types/ModFiles';
import { Box } from '@mui/system';

const PathDialogue = ({ type, enterDelay }: { type: FilePath; enterDelay: number }) => {
    const dispatch = useDispatch();
    const filePaths = useSelector(getFilePaths);

    const [enter, setEnter] = useState<boolean>(false);

    useEffect(() => {
        const timeout = setTimeout(() => setEnter(true), enterDelay);

        return () => clearTimeout(timeout);
    }, [enterDelay]);

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
            case 'core':
                return ['Core Mods', <PublicIcon />];
        }
    }, [type]);

    const id = useMemo<string>(() => `${type}-filepath-textfield-${enterDelay}`, [enterDelay, type]);

    const canReset = useMemo(() => filePaths[type] !== pathDefaults[type], [filePaths, type]);

    const handleChange = (e: React.FormEvent) => {
        e.preventDefault();
        const { value } = e.target as HTMLTextAreaElement;
        dispatch(setFilePath({ newPath: value, target: type }));
    };

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setFilePath({ newPath: pathDefaults[type], target: type }));
        document.getElementById(id)?.focus();
    };

    const handleOpenInFolder = (e: React.FormEvent) => {
        e.preventDefault();
        window.api.createProcess(filePaths[type]);
    };

    return (
        <Slide in={enter} direction="right">
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
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
                    id={id}
                />
                <Stack direction="row-reverse">
                    <Slide direction="left" in={canReset}>
                        <Tooltip title="Reset to Default">
                            <Button onClick={handleReset}>
                                <RestartAltIcon color="error" />
                            </Button>
                        </Tooltip>
                    </Slide>
                    <Tooltip title="Open in Folder" placement="left">
                        <Button onClick={handleOpenInFolder}>
                            <FolderOpenIcon />
                        </Button>
                    </Tooltip>
                </Stack>
            </Box>
        </Slide>
    );
};

const FilePath = () => {
    const filePaths = useSelector(getFilePaths);

    return (
        <Stack spacing={2}>
            {/* <Typography variant="h5">File Paths</Typography> */}
            {Object.keys(filePaths).map((key, i) => (
                <PathDialogue type={key as FilePath} enterDelay={i * 100} key={i} />
            ))}
        </Stack>
    );
};

export default FilePath;
