import {
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    cloneCustomList,
    deleteCustomList,
    getCustomLists,
    getSelectedListId,
    setSelectedList,
} from '../../../redux/slices/listManager';
import NotSelectedOverlay from '../../NotSelectedOverlay';
import AddIcon from '@mui/icons-material/Add';
import ListsDashboard from './ListsDashboard';
import NewListModal from './NewListModal/MakeNewListModal';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import CustomList from '../../../../types/CustomList';
import ListRenameModal from './ListsDashboard/Toolbar/RenameModal';
import ListPreview from './ListPreview/ListPreview';

const ListsTableRow = ({ list }: { list: CustomList }) => {
    const dispatch = useDispatch();

    const selectedListId = useSelector(getSelectedListId);
    const isSelected = useMemo<boolean>(() => selectedListId === list.id, [list.id, selectedListId]);

    const handleSelect = useCallback(() => dispatch(setSelectedList(list.id)), [dispatch, list.id]);

    const handleClone = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            dispatch(cloneCustomList(list.id));
        },
        [dispatch, list],
    );

    const handleDelete = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            dispatch(deleteCustomList(list.id));
        },
        [dispatch, list],
    );

    const [renameMode, setRenameMode] = useState<boolean>(false);

    const handleToggleRenameMode = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setRenameMode(!renameMode);
        },
        [renameMode],
    );

    return (
        <TableRow hover onClick={handleSelect} selected={isSelected} sx={{ cursor: 'pointer' }} className="noSelect">
            <TableCell component="th" scope="row">
                {list.name}
            </TableCell>
            <TableCell align="right">{list.description}</TableCell>
            <TableCell align="right">{moment(list.lastModified).fromNow()}</TableCell>
            <TableCell align="right">{list.mods.length}</TableCell>
            <TableCell align="right" padding="checkbox">
                <Tooltip title="Delete">
                    <Button onClick={handleDelete}>
                        <DeleteIcon />
                    </Button>
                </Tooltip>
            </TableCell>
            <TableCell align="right" padding="checkbox">
                <Tooltip title="Clone">
                    <Button onClick={handleClone}>
                        <ContentCopyIcon />
                    </Button>
                </Tooltip>
            </TableCell>
            <TableCell align="right" padding="checkbox">
                <Tooltip title="Rename">
                    <Button onClick={handleToggleRenameMode}>
                        <EditIcon />
                    </Button>
                </Tooltip>
            </TableCell>
            <ListRenameModal open={renameMode} setOpen={setRenameMode} list={list} />
        </TableRow>
    );
};

const ListsTable = () => {
    const lists = useSelector(getCustomLists);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Description</TableCell>
                        <TableCell align="right">Last Modified</TableCell>
                        <TableCell align="right">Mods</TableCell>
                        <TableCell align="right" padding="checkbox" />
                        <TableCell align="right" padding="checkbox" />
                        <TableCell align="right" padding="checkbox" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(lists).map((list, index) => (
                        <ListsTableRow key={index} list={list} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const ListsPage = () => {
    const modlists = useSelector(getCustomLists);

    const numModlists = useMemo<number>(() => Object.keys(modlists).length, [modlists]);

    const [newListModalOpen, setNewListModalOpen] = useState<boolean>(false);

    return (
        <Grid container sx={{ flexGrow: 1, position: 'relative', overflowY: 'hidden' }}>
            <Grid item xs={8} sx={{ height: '50%' }}>
                <ListsDashboard />
            </Grid>
            <Grid item xs={4}>
                <ListPreview />
            </Grid>
            <Grid
                item
                xs={12}
                sx={{
                    height: '50%',
                    overflowY: numModlists ? 'auto' : 'hidden',
                }}
            >
                <Typography variant="h5" sx={{ mt: 1, ml: 1 }}>
                    Saved Mod Lists ({numModlists}){' '}
                    <Tooltip title="New List">
                        <Button onClick={() => setNewListModalOpen(true)}>
                            <AddIcon />
                        </Button>
                    </Tooltip>
                </Typography>
                {numModlists ? (
                    <ListsTable />
                ) : (
                    <NotSelectedOverlay
                        text="No Lists Found"
                        actionElement={
                            <Button color="success" size="large" onClick={() => setNewListModalOpen(true)}>
                                Make One
                            </Button>
                        }
                    />
                )}
            </Grid>
            <NewListModal open={newListModalOpen} setOpen={setNewListModalOpen} />
        </Grid>
    );
};

export default ListsPage;
