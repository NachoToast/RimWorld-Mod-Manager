import { Divider, Fade, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedList } from '../../../redux/slices/listManager';
import { getModLibrary } from '../../../redux/slices/modLibrary';
import NotSelectedOverlay from '../../NotSelectedOverlay';
import NoListSelectedModal from './NoListSelectedModal/NoListSelectedModal';

const SortPage = () => {
    const modLibrary = useSelector(getModLibrary);
    const selectedList = useSelector(getSelectedList);

    if (!selectedList)
        return (
            <div style={{ flexGrow: 1 }}>
                <NoListSelectedModal />
            </div>
        );

    return (
        <Fade in>
            <Grid container sx={{ flexGrow: 1, position: 'relative', overflowY: 'hidden' }}>
                <Grid item xs={6} sx={{ border: 'solid 1px pink', p: 1, height: '70%', overflowY: 'auto' }}>
                    <Typography textAlign="center" variant="h4">
                        All Mods
                    </Typography>
                    <Stack spacing={1} divider={<Divider flexItem />} sx={{ overflowY: 'auto' }}>
                        {Object.values(modLibrary).map((mod, index) => (
                            <span key={index}>{mod.name}</span>
                        ))}
                    </Stack>
                </Grid>
                <Grid item xs={6} sx={{ border: 'solid 1px aquamarine', p: 1, height: '70%' }}>
                    <Typography textAlign="center" variant="h4">
                        {selectedList.name}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ border: 'solid 1px green', p: 1, height: '30%' }}>
                    <NotSelectedOverlay text="Select a mod to preview" />
                </Grid>
            </Grid>
        </Fade>
    );
};

export default SortPage;
