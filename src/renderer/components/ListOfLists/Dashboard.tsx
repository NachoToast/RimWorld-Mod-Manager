import { Button, Stack, TextField, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentList, getLists, modifyList, removeList, saveModsToList } from '../../redux/slices/listManager.slice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getModList } from '../../redux/slices/modManager.slice';
import SaveIcon from '@mui/icons-material/Save';
import { getConfig } from '../../redux/slices/main.slice';
import SaveList from '../../../types/SavedList';

const Dashboard = () => {
    const dispatch = useDispatch();
    const currentList = useSelector(getCurrentList);
    const lists = useSelector(getLists);
    const currentMods = useSelector(getModList);
    const config = useSelector(getConfig);

    const [newName, setNewName] = useState<string>('');

    useEffect(() => {
        setNewName(currentList?.name ?? '');
    }, [currentList?.name]);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const toggleEditMode = useCallback(() => {
        setIsEditing(!isEditing);
    }, [isEditing]);

    const handleDelete = useCallback(() => {
        if (!currentList) return;
        dispatch(removeList(currentList.name));
    }, [currentList, dispatch]);

    const saveModList = useCallback(() => {
        if (!currentList) return;
        dispatch(saveModsToList(currentList.name));
    }, [currentList, dispatch]);

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
            dispatch(modifyList({ oldListName: currentList.name, newList: { ...currentList, name: e.target.value } }));
        },
        [currentList, dispatch, lists],
    );

    if (!currentList) return <></>;

    return (
        <Box>
            <TextField
                variant="standard"
                autoFocus
                value={newName}
                error={!!errorMessage.length}
                label={errorMessage || 'Name'}
                onChange={modifyName}
                disabled={!isEditing}
                InputProps={{ disableUnderline: !isEditing }}
            />

            <Stack>
                <span>Mods: {currentMods.packageIds.length}</span>
                <span>
                    Created: {new Date(currentList.createdAt).toLocaleDateString(config.locale)}{' '}
                    <span style={{ color: 'gray' }}>({moment(currentList.createdAt).fromNow()})</span>
                </span>
                <TextField
                    variant="standard"
                    value={currentList.description}
                    label="Description"
                    maxRows={6}
                    multiline
                    disabled={!isEditing}
                    InputProps={{ disableUnderline: true }}
                />
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Delete">
                        <Button onClick={handleDelete}>
                            <DeleteIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Save">
                        <Button onClick={saveModList}>
                            <SaveIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Edit Name/Description">
                        <Button onClick={toggleEditMode}>
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
                </Stack>
            </Stack>
        </Box>
    );
};

export default Dashboard;
