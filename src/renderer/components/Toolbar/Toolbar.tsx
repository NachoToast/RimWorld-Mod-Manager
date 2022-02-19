import React, { useEffect, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import { Button, Fade, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getModGrouping, GroupingOptions, setModGrouping } from '../../redux/slices/main.slice';

const groupingOptions: GroupingOptions[] = ['none', 'source', 'alphabetical', 'author'];

const Toolbar = () => {
    const dispatch = useDispatch();
    const modGrouping = useSelector(getModGrouping);
    const [groupMenuOpen, setGroupMenuOpen] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        function searchOnEnter(e: KeyboardEvent) {
            if (e.key === 'Enter') {
                console.log('searching!');
            }
        }

        if (searchTerm) {
            window.addEventListener('keydown', searchOnEnter);
        }

        return () => {
            window.removeEventListener('keydown', searchOnEnter);
        };
    }, [searchTerm]);

    return (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
            <TextField
                id="searchInput"
                sx={{ flexGrow: 1 }}
                variant="standard"
                label="Search Mods"
                value={searchTerm}
                onInput={(e) => {
                    const { value } = e.target as HTMLTextAreaElement;
                    setSearchTerm(value);
                }}
            />
            <Button disabled={!searchTerm} onClick={() => console.log('searching!')}>
                <SearchIcon />
            </Button>
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
                <Button color={groupMenuOpen ? 'success' : 'primary'} onClick={() => setGroupMenuOpen(!groupMenuOpen)}>
                    <CategoryIcon />
                </Button>
            </Tooltip>
        </Stack>
    );
};

export default Toolbar;
