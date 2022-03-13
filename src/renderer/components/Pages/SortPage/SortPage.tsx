import { Fade, Grid, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { PackageId } from '../../../../types/ModFiles';
import { getSelectedList } from '../../../redux/slices/listManager';
import ModPreviewLine from '../../ModPreviewLine';
import AllModsList from './AllModsList/AllModsList';
import NoListSelectedModal from './NoListSelectedModal/NoListSelectedModal';
import './SortPage.css';

const emptySet = new Set<PackageId>();

const SortPage = () => {
    const selectedList = useSelector(getSelectedList);

    const activeMods = useMemo<Set<PackageId>>(() => {
        if (!selectedList) return emptySet;
        return new Set(selectedList.mods);
    }, [selectedList]);

    if (!selectedList)
        return (
            <div style={{ flexGrow: 1 }}>
                <NoListSelectedModal />
            </div>
        );

    return (
        <Fade in>
            <Grid container sx={{ flexGrow: 1, position: 'relative', overflowY: 'hidden' }}>
                <Grid
                    item
                    xs={6}
                    sx={{
                        border: 'solid 1px pink',
                        height: '70%',
                        overflowY: 'auto',
                        display: 'flex',
                        flexFlow: 'column nowrap',
                    }}
                >
                    <AllModsList activeList={activeMods} />
                </Grid>
                <Grid item xs={6} sx={{ border: 'solid 1px aquamarine', p: 1, height: '70%' }}>
                    <Typography textAlign="center" variant="h4">
                        {selectedList.name}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ border: 'solid 1px green', p: 1, height: '30%' }}>
                    <ModPreviewLine />
                </Grid>
            </Grid>
        </Fade>
    );
};

export default SortPage;
