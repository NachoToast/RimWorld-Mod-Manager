import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedList } from '../../../../redux/slices/listManager';
import NotSelectedOverlay from '../../../NotSelectedOverlay';
import Toolbar from './Toolbar';
import EditIcon from '@mui/icons-material/Edit';

const ListsDashboard = () => {
    const list = useSelector(getSelectedList);

    if (!list)
        return (
            <NotSelectedOverlay
                text="Select a list to modify"
                customIcon={<EditIcon color="disabled" sx={{ fontSize: '64px', pointerEvents: 'none' }} />}
            />
        );

    return (
        <Stack direction="column" sx={{ height: '100%', p: 1 }}>
            <div style={{ flexGrow: 1 }}>
                <Typography variant="h4">{list.name}</Typography>
                <Typography>{list.description}</Typography>
                <Typography>{list.rimWorldVersion}</Typography>
            </div>
            <Toolbar list={list} />
        </Stack>
    );
};

export default ListsDashboard;
