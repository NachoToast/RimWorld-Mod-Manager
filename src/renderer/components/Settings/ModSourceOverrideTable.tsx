import {
    Button,
    Fade,
    IconButton,
    MenuItem,
    Paper,
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
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModSource, PackageId } from '../../../types/ModFiles';
import { getModOverrides, setModOverrides } from '../../redux/slices/main.slice';
import ClearIcon from '@mui/icons-material/Clear';
import { defaultModSourceOverrides } from '../../constants/constants';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import WarningIcon from '@mui/icons-material/ReportGmailerrorred';
import { getModLibrary } from '../../redux/slices/modManager.slice';

const sources: ModSource[] = ['core', 'local', 'workshop'];

const ModSourceOverrideTable = () => {
    const dispatch = useDispatch();
    const modOverrides = useSelector(getModOverrides);
    const modLibrary = useSelector(getModLibrary);

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
    }, [modOverrides]);

    const handleSourceChange = (e: SelectChangeEvent, packageId: PackageId) => {
        e.preventDefault();
        const newSource = e.target.value as ModSource;
        const newOverrides = { ...modOverrides };
        newOverrides[packageId] = newSource;
        dispatch(setModOverrides(newOverrides));
    };

    const [isHovered, setIsHovered] = useState(false);

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
        <Box onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h5" gutterBottom>
                    Mod Version Overrides
                    <Fade in={isHovered && !creatingRow}>
                        <IconButton onClick={() => setCreatingRow(true)}>
                            <AddIcon />
                        </IconButton>
                    </Fade>
                </Typography>
                <Fade in={isHovered}>
                    <Slide direction="left" in={!isDefault}>
                        <Tooltip title="Reset to Default">
                            <Button onClick={reset}>
                                <RestartAltIcon color="error" />
                            </Button>
                        </Tooltip>
                    </Slide>
                </Fade>
            </Stack>
            <TableContainer component={Paper}>
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
                                    <TableRow key={index}>
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

export default ModSourceOverrideTable;
