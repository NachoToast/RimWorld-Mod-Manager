import {
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFocussedMod } from '../../redux/slices/main';
import ModDependencies from '../ModDependencies/ModDependencies';
import ModDescription from '../ModDescription';
import NotSelectedOverlay from '../NotSelectedOverlay';
import PreviewImageCarousel from '../PreviewImageCarousel';
import AddIcon from '@mui/icons-material/Add';
import { addModsToSelectedList, getSelectedList, modifyCustomList } from '../../redux/slices/listManager';
import RemoveIcon from '@mui/icons-material/Remove';

const ModPreviewLine = () => {
    const dispatch = useDispatch();
    const mod = useSelector(getFocussedMod);
    const selectedList = useSelector(getSelectedList);
    const isInModList = useMemo<boolean>(
        () => !!mod && !!selectedList?.mods.includes(mod.packageId.toLowerCase()),
        [mod, selectedList?.mods],
    );

    const handleListToggle = useCallback(() => {
        if (!mod) throw new Error('Add/Remove button was clicked without a mod being selected');
        if (isInModList) {
            if (!selectedList) throw new Error("Cant remove mod, selected list doesn't exist");
            const listMods = [...selectedList.mods];
            const index = listMods.indexOf(mod.packageId.toLowerCase());
            if (index === -1) throw new Error(`Mod ${mod.packageId} not actually in selected list`);
            else listMods.splice(index, 1);

            dispatch(modifyCustomList({ ...selectedList, mods: listMods }));
        } else {
            dispatch(addModsToSelectedList({ packageIds: [mod.packageId] }));
        }
    }, [dispatch, isInModList, mod, selectedList]);

    if (!mod) return <NotSelectedOverlay text="Select a mod to preview" />;

    return (
        <Stack direction="row" sx={{ height: '100%', position: 'relative', width: '100%' }} spacing={1}>
            <PreviewImageCarousel images={mod.previewImages} />
            <Stack sx={{ overflowY: 'auto', flexGrow: 1 }}>
                <Stack direction="row" spacing={1}>
                    <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                        {mod.name}
                    </Typography>
                    <Tooltip title={isInModList ? 'Remove from list' : 'Add to list'}>
                        <Button onClick={handleListToggle}>{isInModList ? <RemoveIcon /> : <AddIcon />}</Button>
                    </Tooltip>
                </Stack>
                <ModDescription mod={mod} />
            </Stack>
            <TableContainer sx={{ width: 'max-content', minWidth: 350 }}>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" sx={{ whiteSpace: 'nowrap' }}>
                                Package ID
                            </TableCell>
                            <TableCell>{mod.packageId}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th">Author{mod.authors.length !== 1 ? 's' : ''}</TableCell>
                            <TableCell>{mod.authors.join(', ')}</TableCell>
                        </TableRow>
                        {!!mod.supportedVersions.length && (
                            <TableRow>
                                <TableCell component="th">
                                    Version{mod.supportedVersions.length !== 1 ? 's' : ''}
                                </TableCell>
                                <TableCell>
                                    {mod.supportedVersions.map((e) => (e === 1 ? '1.0' : e)).join(', ')}
                                </TableCell>
                            </TableRow>
                        )}
                        {!!mod.incompatibleWith.length && (
                            <TableRow>
                                <TableCell component="th">Incompatible With</TableCell>
                                <TableCell>{mod.incompatibleWith.join(', ')}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <ModDependencies mod={mod} />
        </Stack>
    );
};

export default ModPreviewLine;
