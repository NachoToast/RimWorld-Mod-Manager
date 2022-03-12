import { Divider, Stack } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedList } from '../../../../redux/slices/listManager';
import NotSelectedOverlay from '../../../NotSelectedOverlay';
import FilterNoneIcon from '@mui/icons-material/FilterNone';

const ListPreview = () => {
    const list = useSelector(getSelectedList);

    if (!list) return <NotSelectedOverlay text="Select a list to preview" />;
    if (!list.mods.length)
        return (
            <NotSelectedOverlay
                text="This list is empty"
                customIcon={<FilterNoneIcon color="disabled" sx={{ fontSize: '64px', pointerEvents: 'none' }} />}
            />
        );

    console.log(list.mods);

    return (
        <Stack direction="column" spacing={1} divider={<Divider flexItem />} sx={{ height: '100%' }}>
            {/* {list.mods.map((packageId, index) => (
                <span key={index}>{modLibrary[packageId.toLowerCase()]?.name || packageId}</span>
            ))} */}
        </Stack>
    );
};

export default ListPreview;
