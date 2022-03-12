import { Modal, Typography, Stack, Button, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomLists, setSelectedList } from '../../../../redux/slices/listManager';
import { Pages, setPage } from '../../../../redux/slices/main';

const NoListSelectedModal = () => {
    const dispatch = useDispatch();

    const selectList = useCallback((e: SelectChangeEvent) => dispatch(setSelectedList(e.target.value)), [dispatch]);

    const availableLists = Object.values(useSelector(getCustomLists));

    return (
        <Modal open>
            <Stack
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
                direction="column"
                alignItems="center"
                spacing={1}
            >
                <Typography variant="h6" component="h2" textAlign="center">
                    No List Selected
                </Typography>
                {availableLists.length ? (
                    <>
                        <Typography>Please select a list to edit</Typography>
                        <FormControl fullWidth>
                            <Select labelId="list-select" value="" onChange={selectList}>
                                {availableLists.map((list, index) => (
                                    <MenuItem key={index} value={list.id}>
                                        {list.name} ({list.mods.length} Mod{list.mods.length !== 1 ? 's' : ''})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                ) : (
                    <Typography>
                        Please make a list in the <span>Lists</span> page.
                    </Typography>
                )}
                <Button size="large" onClick={() => dispatch(setPage(Pages.Lists))}>
                    Lists Page
                </Button>
            </Stack>
        </Modal>
    );
};

export default NoListSelectedModal;
