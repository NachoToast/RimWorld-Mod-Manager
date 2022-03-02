import { Button, Modal, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addList,
    getCurrentList,
    getLists,
    modifyList,
    removeList,
    setCurrentList,
} from '../../redux/slices/listManager';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getModList } from '../../redux/slices/modManager';
import { getConfig, getFilePaths, getRimWorldVersion } from '../../redux/slices/main';
import SaveList from '../../../types/SavedList';
import { defaultList } from '../../constants';
import toModsConfigFile from '../../helpers/configFileSaver';

const ListsDashboard = () => {
    const dispatch = useDispatch();
    const currentList = useSelector(getCurrentList);
    const lists = useSelector(getLists);
    const currentMods = useSelector(getModList);
    const config = useSelector(getConfig);
    const modList = useSelector(getModList);
    const version = useSelector(getRimWorldVersion);
    const filePaths = useSelector(getFilePaths);

    const [newName, setNewName] = useState<string>('');
    const [newDesc, setNewDesc] = useState<string>('');

    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    useEffect(() => {
        setNewName(currentList.name);

        setNewDesc(currentList.description);
    }, [currentList.description, currentList.name]);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!currentList) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                if (isEditing) {
                    setIsEditing(false);
                    setNewName(currentList.name);
                    setNewDesc(currentList.description);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentList, isEditing]);

    const toggleEditMode = useCallback(() => {
        if (isEditing) {
            // closing
            const newList: SaveList = { ...currentList };

            if (!errorMessage) newList.name = newName;
            newList.description = newDesc;

            dispatch(modifyList({ oldListName: currentList.name, newList }));
        }

        setIsEditing(!isEditing);
    }, [currentList, dispatch, errorMessage, isEditing, newDesc, newName]);

    const canDelete = useMemo(() => currentList?.name !== defaultList.name, [currentList?.name]);

    const handleDelete = useCallback(() => {
        dispatch(removeList(currentList.name));
        setIsDeleting(false);
    }, [currentList, dispatch]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleDelete();
            }
        };

        if (isDeleting) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleDelete, isDeleting]);

    const handleClone = useCallback(() => {
        const endsWithSuffix = new RegExp(/-[0-9]+$/g).test(currentList.name);

        let nameToCheck = currentList.name;
        let suffix = 1;
        if (endsWithSuffix) {
            const splitName = currentList.name.split('-');
            nameToCheck = splitName.slice(0, -1).join('-');
            suffix = Number(splitName.at(-1) || '1');
        }

        while (lists[`${nameToCheck}-${suffix}`]) {
            suffix++;
        }

        const newList: SaveList = { ...currentList, name: `${nameToCheck}-${suffix}` };

        dispatch(addList(newList));
        dispatch(setCurrentList(newList.name));
    }, [currentList, dispatch, lists]);

    const modifyName = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setNewName(value);
            if (!value.length) {
                setErrorMessage('Too Short');
                return;
            }
            const listWithThatName = lists[e.target.value] as SaveList | undefined;
            if (listWithThatName) {
                setErrorMessage('Duplicate Name');
                return;
            }
            setErrorMessage('');
        },
        [lists],
    );

    const handleExport = useCallback(() => {
        if (!version.native?.full || !version.knownExpansions) return;

        const output = toModsConfigFile(modList.packageIds, version.native.full, version.knownExpansions);

        const blob = new Blob([output], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'ModsConfig.xml';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [modList.packageIds, version]);

    const [savedSuccessfully, setSavedSuccessfully] = useState<boolean | null>(null);

    const handleSaveToRimWorld = useCallback(() => {
        if (!version.native?.full || !version.knownExpansions) return;

        const output = toModsConfigFile(modList.packageIds, version.native.full, version.knownExpansions);

        try {
            window.api.listSaver(filePaths.modlist, output);
            setSavedSuccessfully(true);
        } catch (error) {
            setSavedSuccessfully(false);
            console.log(error);
        }
    }, [filePaths.modlist, modList.packageIds, version]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined = undefined;

        if (savedSuccessfully !== null) {
            timeout = setTimeout(() => setSavedSuccessfully(null), 1000);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [savedSuccessfully]);

    return (
        <Box>
            {isEditing ? (
                <TextField
                    variant="standard"
                    autoFocus
                    value={newName}
                    error={!!errorMessage.length}
                    label={errorMessage || 'Change Name'}
                    onChange={modifyName}
                />
            ) : (
                <Typography variant="h6" gutterBottom>
                    {currentList.name}
                </Typography>
            )}

            <Stack>
                <span>Mods: {currentMods.packageIds.length}</span>
                <span>
                    Created: {new Date(currentList.createdAt).toLocaleDateString(config.locale)}{' '}
                    <span style={{ color: 'gray' }}>({moment(currentList.createdAt).fromNow()})</span>
                </span>
                {isEditing ? (
                    <TextField
                        variant="standard"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        maxRows={6}
                        label="Edit Description"
                        multiline
                        InputProps={{ disableUnderline: true }}
                    />
                ) : (
                    <Typography>{currentList.description}</Typography>
                )}
                <Stack direction="row" spacing={1}>
                    <Tooltip title={canDelete ? 'Delete' : 'Cannot Delete'}>
                        <span>
                            <Button onClick={() => setIsDeleting(true)} disabled={!canDelete}>
                                <DeleteIcon />
                            </Button>
                        </span>
                    </Tooltip>
                    <Tooltip title={isEditing ? 'Save Changes' : 'Edit Name/Description'}>
                        <Button onClick={toggleEditMode} color={isEditing ? 'secondary' : 'primary'}>
                            <EditIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Export to File">
                        <Button onClick={handleExport}>
                            <UploadFileIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        title={
                            savedSuccessfully
                                ? 'Saved!'
                                : savedSuccessfully === false
                                ? 'Error Occurred'
                                : 'Save to RimWorld'
                        }
                    >
                        <Button onClick={handleSaveToRimWorld}>
                            <CheckCircleOutlineIcon
                                color={
                                    savedSuccessfully ? 'success' : savedSuccessfully === false ? 'error' : 'primary'
                                }
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Clone">
                        <Button onClick={handleClone}>
                            <ContentCopyIcon />
                        </Button>
                    </Tooltip>
                </Stack>
            </Stack>
            <Modal open={isDeleting} onClose={() => setIsDeleting(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 450,
                        bgcolor: 'background.paper',
                        border: 'solid 2px #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography textAlign="center" gutterBottom>
                        Are you sure you want to delete <span style={{ color: 'pink' }}>{currentList.name}</span>?
                    </Typography>
                    <Stack sx={{ width: '100%' }} direction="row" justifyContent="space-evenly">
                        <Button onClick={handleDelete} color="warning">
                            Yes
                        </Button>
                        <Button onClick={() => setIsDeleting(false)}>No</Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
};

export default ListsDashboard;
