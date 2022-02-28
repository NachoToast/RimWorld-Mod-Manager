import { Button, Stack, TextField, Tooltip, Typography } from '@mui/material';
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
} from '../../redux/slices/listManager.slice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getModList } from '../../redux/slices/modManager.slice';
import { getConfig } from '../../redux/slices/main.slice';
import SaveList from '../../../types/SavedList';
import { defaultList } from '../../constants/constants';

const Dashboard = () => {
    const dispatch = useDispatch();
    const currentList = useSelector(getCurrentList);
    const lists = useSelector(getLists);
    const currentMods = useSelector(getModList);
    const config = useSelector(getConfig);

    const [newName, setNewName] = useState<string>('');
    const [newDesc, setNewDesc] = useState<string>('');

    useEffect(() => {
        setNewName(currentList?.name ?? '');

        setNewDesc(currentList?.description ?? '');
    }, [currentList?.description, currentList?.name]);

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
        if (!currentList) return;

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
        if (!currentList) return;
        dispatch(removeList(currentList.name));
    }, [currentList, dispatch]);

    // const saveModList = useCallback(() => {
    //     if (!currentList) return;
    //     dispatch(saveModsToList(currentList.name));
    // }, [currentList, dispatch]);

    const handleClone = useCallback(() => {
        if (!currentList) return;
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
            if (!currentList) {
                setErrorMessage('Unknown Error');
                return;
            }
            const listWithThatName = lists[e.target.value] as SaveList | undefined;
            if (listWithThatName) {
                setErrorMessage('Duplicate Name');
                return;
            }
            setErrorMessage('');
        },
        [currentList, lists],
    );

    if (!currentList) return <></>;

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
                            <Button onClick={handleDelete} disabled={!canDelete}>
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
                        <Button>
                            <UploadFileIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Save to RimWorld">
                        <Button>
                            <CheckCircleOutlineIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Clone">
                        <Button onClick={handleClone}>
                            <ContentCopyIcon />
                        </Button>
                    </Tooltip>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Dashboard;
