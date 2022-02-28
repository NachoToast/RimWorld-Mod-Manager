import { Button, Divider, Fade, Stack, Tooltip, Typography } from '@mui/material';
import React, { useMemo, useCallback } from 'react';
import SaveList from '../../../types/SavedList';
import UploadIcon from '@mui/icons-material/Upload';
import { Box } from '@mui/system';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentList, getLists, loadModsFromList } from '../../redux/slices/listManager.slice';

const ModList = ({ list, index }: { list: SaveList; index: number }) => {
    const dispatch = useDispatch();

    const currentList = useSelector(getCurrentList);
    const isCurrent = useMemo(() => list.name === currentList?.name, [currentList?.name, list.name]);
    const loadModList = useCallback(() => {
        dispatch(loadModsFromList(list.name));
    }, [dispatch, list.name]);

    return (
        <Stack sx={{ width: '100%', pr: 1, pl: 1, overflowX: 'auto' }} direction="row" alignItems="center" spacing={1}>
            <Stack sx={{ flexGrow: 1 }}>
                <span style={{ flexGrow: 1, whiteSpace: 'nowrap', color: isCurrent ? 'pink' : undefined }}>
                    {index + 1}. {list.name}
                </span>
                <span style={{ color: 'gray', whiteSpace: 'nowrap' }}>
                    Last modified {moment(list.lastModified).fromNow()}
                </span>
            </Stack>
            <Fade in={!isCurrent}>
                <Tooltip title="Load" placement="left">
                    <Button onClick={loadModList}>
                        <UploadIcon fontSize="large" />
                    </Button>
                </Tooltip>
            </Fade>
        </Stack>
    );
};

const ListOfLists = () => {
    const lists = useSelector(getLists);

    return (
        <Box sx={{ border: 'solid 1px gray', borderRadius: '0.2rem', pb: 1, overflowY: 'auto' }} height={600}>
            <Typography variant="h6" textAlign="center" gutterBottom sx={{ pt: 1 }}>
                Saved Mod Lists
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack spacing={1} divider={<Divider flexItem />}>
                {Object.keys(lists).map((key, index) => (
                    <ModList list={lists[key]} key={index} index={index} />
                ))}
            </Stack>
        </Box>
    );
};

export default ListOfLists;
