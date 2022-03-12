import { Stack, Button, Tooltip } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import CheckIcon from '@mui/icons-material/Check';
import CustomList from '../../../../../../types/CustomList';
import { useDispatch } from 'react-redux';
import {
    applyCustomModlist,
    cloneCustomList,
    deleteCustomList,
    exportCustomList,
} from '../../../../../redux/slices/listManager';
import ListRenameModal from './RenameModal';

const Toolbar = ({ list }: { list: CustomList }) => {
    const dispatch = useDispatch();

    const handleClone = useCallback(() => dispatch(cloneCustomList(list.id)), [dispatch, list]);

    const handleDelete = useCallback(() => dispatch(deleteCustomList(list.id)), [dispatch, list]);

    const handleExport = useCallback(() => dispatch(exportCustomList(list)), [dispatch, list]);

    const [justApplied, setJustApplied] = useState<boolean>(false);

    const handleApply = useCallback(() => {
        dispatch(applyCustomModlist(list));
        setJustApplied(true);
    }, [dispatch, list]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined = undefined;

        if (justApplied) {
            timeout = setTimeout(() => setJustApplied(false), 2000);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [justApplied]);

    const [renameMode, setRenameMode] = useState<boolean>(false);

    const handleToggleRenameMode = useCallback(() => setRenameMode(!renameMode), [renameMode]);

    return (
        <Stack direction="row" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Tooltip title="Delete this list" placement="top">
                <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleDelete}>
                    Delete
                </Button>
            </Tooltip>
            <Tooltip title="Clone this list" placement="top">
                <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleClone}>
                    Clone
                </Button>
            </Tooltip>
            <Tooltip title="Edit name and description" placement="top">
                <Button variant="outlined" startIcon={<EditIcon />} onClick={handleToggleRenameMode}>
                    Rename
                </Button>
            </Tooltip>
            <Tooltip title="Export to file" placement="top">
                <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={handleExport}>
                    Export
                </Button>
            </Tooltip>
            <Tooltip title={justApplied ? 'Applied!' : 'Apply to RimWorld'} placement="top">
                <Button
                    color={justApplied ? 'success' : 'primary'}
                    variant="outlined"
                    startIcon={justApplied ? <CheckIcon /> : <FileDownloadDoneIcon />}
                    onClick={handleApply}
                >
                    Apply
                </Button>
            </Tooltip>
            <ListRenameModal open={renameMode} setOpen={setRenameMode} list={list} />
        </Stack>
    );
};

export default Toolbar;
