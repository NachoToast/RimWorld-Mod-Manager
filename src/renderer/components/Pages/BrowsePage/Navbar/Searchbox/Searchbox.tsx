import { TextField, Fade, InputAdornment, IconButton, Stack, Button, Grow } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLibrarySize, searchMods, unhideMods } from '../../../../../redux/slices/modLibrary';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

const getSearchElement = () => document.querySelector<HTMLTextAreaElement>('#searchInput');

const Searchbox = () => {
    const dispatch = useDispatch();

    const numMods = useSelector(getLibrarySize);

    const [searchTerm, setSearch] = useState<string>('');

    const handleSearchInput = useCallback(() => {
        return (e: React.FormEvent) => {
            const { value } = e.target as HTMLTextAreaElement;
            setSearch(value);
        };
    }, []);

    const submitSearch = useCallback(() => {
        if (searchTerm) {
            dispatch(searchMods(searchTerm));
        } else {
            dispatch(unhideMods());
        }
    }, [dispatch, searchTerm]);

    const handleClearSearch = useCallback(() => {
        return () => {
            dispatch(unhideMods());
            setSearch('');
            getSearchElement()?.focus();
        };
    }, [dispatch]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitSearch();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [submitSearch]);

    return (
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ pt: 1 }}>
            <Stack direction="column" justifyContent="center">
                <TextField
                    id="searchInput"
                    variant="standard"
                    value={searchTerm}
                    placeholder={`Search ${numMods} mod${numMods !== 1 ? 's' : ''}`}
                    onInput={handleSearchInput()}
                    InputProps={{
                        endAdornment: (
                            <Fade in={!!searchTerm.length}>
                                <InputAdornment position="end">
                                    <IconButton edge="end" onClick={handleClearSearch()}>
                                        <ClearIcon fontSize="small" color="disabled" />
                                    </IconButton>
                                </InputAdornment>
                            </Fade>
                        ),
                    }}
                />
                <Fade in={!!searchTerm.length}>
                    <span style={{ color: '#676767' }}>Press enter to search</span>
                </Fade>
            </Stack>
            <Grow in={!!searchTerm.length}>
                <Button onClick={submitSearch}>
                    <SearchIcon />
                </Button>
            </Grow>
        </Stack>
    );
};

export default Searchbox;
