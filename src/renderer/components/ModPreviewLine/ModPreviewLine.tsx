import { Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFocussedMod } from '../../redux/slices/main';
import ModDependencies from '../ModDependencies/ModDependencies';
import ModDescription from '../ModDescription';
import NotSelectedOverlay from '../NotSelectedOverlay';
import PreviewImageCarousel from '../PreviewImageCarousel';

const ModPreviewLine = () => {
    const mod = useSelector(getFocussedMod);

    if (!mod) return <NotSelectedOverlay text="Select a mod to preview" />;

    return (
        <Stack direction="row" sx={{ height: '100%', position: 'relative', width: '100%' }} spacing={1}>
            <PreviewImageCarousel images={mod.previewImages} />
            <Stack sx={{ overflowY: 'auto', flexGrow: 1 }}>
                <Typography variant="h5">{mod.name}</Typography>
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
