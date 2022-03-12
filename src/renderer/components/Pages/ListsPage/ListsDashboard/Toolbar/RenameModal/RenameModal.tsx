import { Modal, Stack, Button, TextField, Collapse } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomList from '../../../../../../../types/CustomList';
import { modifyCustomList } from '../../../../../../redux/slices/listManager';
import SaveIcon from '@mui/icons-material/Save';

interface RenameModalProps {
    list: CustomList;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const RenameModal = (props: RenameModalProps) => {
    const { open, setOpen, list } = props;
    const dispatch = useDispatch();

    const [name, setName] = useState<string>(list.name);
    const [description, setDescription] = useState<string>(list.description);

    const [clickedAway, setClickedAway] = useState<boolean>(false);

    const finishEditing = useCallback(() => {
        dispatch(modifyCustomList({ ...list, name, description }));
        setOpen(false);
    }, [description, dispatch, list, name, setOpen]);

    const handleClose = useCallback(
        (_, reason: 'backdropClick' | 'escapeKeyDown') => {
            if (reason !== 'backdropClick' || clickedAway) setOpen(false);
            else setClickedAway(true);
        },
        [clickedAway, setOpen],
    );

    useEffect(() => {
        if (!open) setClickedAway(false);
    }, [open]);

    return (
        <Modal open={open} onClose={handleClose} onClick={(e) => e.stopPropagation()}>
            <Stack
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    p: 4,
                    outline: 'none',
                }}
                spacing={2}
                alignItems="center"
            >
                <TextField
                    variant="outlined"
                    label="List Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <TextField
                    variant="outlined"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    minRows={3}
                    maxRows={10}
                    fullWidth
                />
                <Button startIcon={<SaveIcon />} size="large" onClick={finishEditing}>
                    Save
                </Button>
                <Collapse in={clickedAway}>
                    <span style={{ color: 'gray' }}>Click background again to exit without saving</span>
                </Collapse>
            </Stack>
        </Modal>
    );
};

export default RenameModal;
