import {
    Button,
    Fade,
    MenuItem,
    Select,
    SelectChangeEvent,
    Slide,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModSource, PackageId } from '../../../../../types/ModFiles';
import { getModOverrides, setModOverrides } from '../../../../redux/slices/main';
import ClearIcon from '@mui/icons-material/Clear';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import WarningIcon from '@mui/icons-material/ReportGmailerrorred';
import { getModLibrary } from '../../../../redux/slices/modManager';
import { defaultConfig } from '../../../../constants';

const sources: ModSource[] = ['core', 'local', 'workshop'];

const ModSourceOverrides = () => {
    const dispatch = useDispatch();
    const modOverrides = useSelector(getModOverrides);
    const modLibrary = useSelector(getModLibrary);

    const defaultModSourceOverrides = useMemo(() => defaultConfig['modSourceOverrides'], []);

    const removeFromList = (e: React.MouseEvent, id: PackageId) => {
        e.preventDefault();
        const newOverrides = { ...modOverrides };
        delete newOverrides[id];
        dispatch(setModOverrides(newOverrides));
    };

    const reset = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(setModOverrides({ ...defaultModSourceOverrides }));
    };

    const isDefault = useMemo(() => {
        if (Object.keys(modOverrides).length !== Object.keys(defaultModSourceOverrides).length) {
            return false;
        }
        for (const packageId in defaultModSourceOverrides) {
            if (modOverrides[packageId] !== defaultModSourceOverrides[packageId]) {
                return false;
            }
        }
        return true;
    }, [defaultModSourceOverrides, modOverrides]);

    const handleSourceChange = (e: SelectChangeEvent, packageId: PackageId) => {
        e.preventDefault();
        const newSource = e.target.value as ModSource;
        const newOverrides = { ...modOverrides };
        newOverrides[packageId] = newSource;
        dispatch(setModOverrides(newOverrides));
    };

    const [creatingRow, setCreatingRow] = useState(false);
    const [newPackageId, setNewPackageId] = useState('');
    const [newSource, setNewSource] = useState<ModSource>('core');

    const resetChoices = (e?: React.MouseEvent) => {
        e?.preventDefault();
        setCreatingRow(false);
        setNewPackageId('');
        setNewSource('core');
    };

    useEffect(() => {
        resetChoices();
    }, []);

    const addToList = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!newPackageId) return;
        const newOverrides = { ...modOverrides, [newPackageId]: newSource };
        dispatch(setModOverrides(newOverrides));
        resetChoices();
    };

    return (
        <Box>
            <Stack direction="row" spacing={1}>
                <Slide direction="right" in={!creatingRow}>
                    <Tooltip title="New Row">
                        <Button onClick={() => setCreatingRow(true)}>
                            <AddIcon fontSize="large" color="success" />
                        </Button>
                    </Tooltip>
                </Slide>
                <Slide direction="right" in={!isDefault}>
                    <Tooltip title="Reset to Default">
                        <Button onClick={reset}>
                            <RestartAltIcon color="error" fontSize="large" />
                        </Button>
                    </Tooltip>
                </Slide>
            </Stack>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Package ID</TableCell>
                            <TableCell align="right">
                                <span style={{ paddingRight: '1rem' }}>Source</span>
                            </TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(modOverrides).map((packageId, index) => {
                            const mod = modLibrary[packageId];

                            const badSources = sources.map((source) => source === mod?.originalSource);

                            return (
                                <Fade in key={index}>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            <Stack>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <span>{packageId}</span>
                                                    {!mod && (
                                                        <Tooltip title="Couldn't find a mod with this package ID">
                                                            <WarningIcon color="warning" />
                                                        </Tooltip>
                                                    )}
                                                </Stack>
                                                <span style={{ color: 'gray' }}>
                                                    {mod?.originalSource
                                                        ? mod.originalSource[0].toUpperCase() +
                                                          mod.originalSource.slice(1)
                                                        : 'Unknown'}{' '}
                                                    mod
                                                </span>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Select
                                                value={modOverrides[packageId]}
                                                onChange={(e) => handleSourceChange(e, packageId)}
                                                sx={{ minWidth: '118px', textAlign: 'left' }}
                                            >
                                                {sources.map((e, i) => (
                                                    <MenuItem key={i} value={e}>
                                                        <Tooltip
                                                            title={
                                                                badSources[i]
                                                                    ? `${mod?.name || packageId} is already a ${
                                                                          sources[i]
                                                                      } mod, no override necessary`
                                                                    : ''
                                                            }
                                                        >
                                                            <span
                                                                style={{
                                                                    color: badSources[i] ? 'lightcoral' : undefined,
                                                                }}
                                                            >
                                                                {e}
                                                            </span>
                                                        </Tooltip>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button onClick={(e) => removeFromList(e, packageId)}>
                                                <ClearIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </Fade>
                            );
                        })}
                        {creatingRow && (
                            <Fade in>
                                <TableRow>
                                    <TableCell component="th" scope="row">
                                        <TextField
                                            label="Package ID"
                                            variant="standard"
                                            spellCheck="false"
                                            autoFocus
                                            onInput={(e) => {
                                                e.preventDefault();
                                                const { value } = e.target as HTMLTextAreaElement;
                                                setNewPackageId(value.toLowerCase());
                                            }}
                                            value={newPackageId}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Select
                                            value={newSource}
                                            onChange={(e) => {
                                                e.preventDefault();
                                                setNewSource(e.target.value as ModSource);
                                            }}
                                            sx={{ minWidth: '118px', textAlign: 'left' }}
                                        >
                                            {sources.map((e, i) => (
                                                <MenuItem key={i} value={e}>
                                                    {e}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button onClick={resetChoices}>
                                            <ClearIcon />
                                        </Button>
                                        <Button onClick={addToList}>
                                            <DoneIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </Fade>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ModSourceOverrides;
