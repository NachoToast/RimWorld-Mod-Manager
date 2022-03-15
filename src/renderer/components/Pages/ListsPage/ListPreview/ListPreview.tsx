import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedList } from '../../../../redux/slices/listManager';
import NotSelectedOverlay from '../../../NotSelectedOverlay';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import { getModLibrary } from '../../../../redux/slices/modLibrary';

const ListPreview = () => {
    const list = useSelector(getSelectedList);
    const modLibrary = useSelector(getModLibrary);

    if (!list) return <NotSelectedOverlay text="Select a list to preview" />;
    if (!list.mods.length)
        return (
            <NotSelectedOverlay
                text="This list is empty"
                customIcon={<FilterNoneIcon color="disabled" sx={{ fontSize: '64px', pointerEvents: 'none' }} />}
            />
        );

    return (
        <Stack direction="column" spacing={1} divider={<Divider flexItem />} sx={{ height: '100%' }}>
            <Typography variant="h5">
                {list.mods.length} Mod{list.mods.length !== 1 ? 's' : ''}
            </Typography>
            {list.mods.map((packageId, index) => (
                <span key={index}>
                    {index + 1}. {modLibrary[packageId.toLowerCase()]?.name || packageId}
                </span>
            ))}
        </Stack>
    );
};

export default ListPreview;
