import React, { useEffect, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import {
    Button,
    Fade,
    FormControl,
    Grow,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    getModGrouping,
    getSearchActive,
    getSearchTerm,
    GroupingOptions,
    setModGrouping,
    setSearchActive,
    setSearchTerm,
} from '../../redux/slices/main.slice';

const groupingOptions: GroupingOptions[] = ['none', 'source', 'alphabetical', 'author'];

const Toolbar = () => {
    const dispatch = useDispatch();
    const searchTerm = useSelector(getSearchTerm);
    const searchActive = useSelector(getSearchActive);

    const modGrouping = useSelector(getModGrouping);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined = undefined;

        if (searchActive) {
            timeout = setTimeout(() => {
                document.getElementById('searchInput')?.focus();
            }, 100);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [searchActive]);

    const [groupMenuOpen, setGroupMenuOpen] = useState(true);

    return (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Grow in={searchActive}>
                <TextField
                    id="searchInput"
                    sx={{ flexGrow: 1 }}
                    variant="standard"
                    label="Search Mods"
                    value={searchTerm}
                    onInput={(e) => {
                        const { value } = e.target as HTMLTextAreaElement;
                        dispatch(setSearchTerm(value));
                    }}
                />
            </Grow>
            <Tooltip title="Search Mods">
                <Button
                    color={searchActive ? 'success' : 'primary'}
                    onClick={() => dispatch(setSearchActive(!searchActive))}
                >
                    <SearchIcon />
                </Button>
            </Tooltip>
            <Tooltip title="Filter Mods">
                <Button>
                    <FilterAltIcon />
                </Button>
            </Tooltip>
            <Fade in={groupMenuOpen} unmountOnExit>
                <FormControl sx={{ width: '120px' }} variant="standard">
                    <InputLabel id="demo-simple-select-label">Mod Grouping</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={modGrouping}
                        label="Age"
                        onChange={(e) => dispatch(setModGrouping(e.target.value as GroupingOptions))}
                    >
                        {groupingOptions.map((e, i) => (
                            <MenuItem value={e} key={i}>
                                {e}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Fade>
            <Tooltip title="Group Mods">
                <Button onClick={() => setGroupMenuOpen(!groupMenuOpen)}>
                    <CategoryIcon />
                </Button>
            </Tooltip>
        </Stack>
    );
};

export default Toolbar;
