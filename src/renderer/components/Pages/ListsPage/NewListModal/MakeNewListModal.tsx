import { Button, Modal, Stack, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getModsConfig, modifyCustomList } from '../../../../redux/slices/listManager';
import { v4 as uuid } from 'uuid';
import CustomList, { SortTypes } from '../../../../../types/CustomList';

interface NewListModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const NewListModal = (props: NewListModalProps) => {
    const { open, setOpen } = props;
    const dispatch = useDispatch();
    const modsConfig = useSelector(getModsConfig);

    const createList = useCallback(
        (source: 'scratch' | 'active') => {
            const newList: CustomList = {
                id: uuid(),
                mods: source === 'active' ? modsConfig?.activeMods || [] : [],
                createdAt: Date.now(),
                lastModified: Date.now(),

                name: 'New List',
                description: source === 'active' ? 'New list made from active mods.' : 'New list made from scratch.',
                rimWorldVersion: modsConfig?.version.major ?? 1.3,
                sorting: source === 'scratch' ? [] : [SortTypes.Unknown],
            };

            dispatch(modifyCustomList(newList));
            setOpen(false);
        },
        [dispatch, modsConfig?.activeMods, modsConfig?.version.major, setOpen],
    );

    return (
        <Modal open={open} onClose={() => setOpen(false)} onClick={(e) => e.stopPropagation()}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    p: 4,
                    outline: 'none',
                }}
            >
                <Typography variant="h6" component="h2" textAlign="center">
                    Make New List From:
                </Typography>
                <Stack sx={{ mt: 2 }} direction="row" spacing={1} justifyContent="space-evenly">
                    <Tooltip title="Will be empty">
                        <Button onClick={() => createList('scratch')}>Scratch</Button>
                    </Tooltip>
                    <Tooltip title="Will have RimWorld's currently active mods">
                        <Button onClick={() => createList('active')}>Active Mods</Button>
                    </Tooltip>
                </Stack>
            </Box>
        </Modal>
    );
};

export default NewListModal;
