import { TextField, Fade, InputAdornment, IconButton, Stack, Button, SxProps, Theme } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLibrarySize, getSearchTerm, searchMods, unhideMods } from '../../redux/slices/modLibrary';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

const getSearchElement = () => document.querySelector<HTMLTextAreaElement>('#searchInput');

interface SearchboxProps {
    /** Placeholder text to display when no value is in the box. */
    placeholder?: string;

    /** Whether to hide the "Press enter to search" hint. */
    hideEnterHint?: boolean;

    sx?: SxProps<Theme>;
}

const Searchbox = (props: SearchboxProps) => {
    const { placeholder, hideEnterHint } = props;
    const dispatch = useDispatch();

    const numMods = useSelector(getLibrarySize);
    const storedSearch = useSelector(getSearchTerm);

    const isSearching = useMemo<boolean>(() => !!storedSearch.length, [storedSearch]);
    const [searchTerm, setSearch] = useState<string>(storedSearch);

    const handleClearSearch = useCallback(() => {
        dispatch(unhideMods());
        setSearch('');
        getSearchElement()?.focus();
    }, [dispatch]);

    const handleSearchInput = useCallback(
        (e: React.FormEvent) => {
            const { value } = e.target as HTMLTextAreaElement;
            if (value.length === 0) handleClearSearch();
            else setSearch(value);
        },
        [handleClearSearch],
    );

    const submitSearch = useCallback(() => {
        if (searchTerm) {
            dispatch(searchMods(searchTerm));
        } else {
            dispatch(unhideMods());
        }
    }, [dispatch, searchTerm]);

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
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ pt: 1, ...props.sx }}>
            <Stack direction="column" justifyContent="center">
                <TextField
                    id="searchInput"
                    variant="standard"
                    value={searchTerm}
                    placeholder={placeholder ?? `Search ${numMods} mod${numMods !== 1 ? 's' : ''}`}
                    onInput={handleSearchInput}
                    InputProps={{
                        endAdornment: (
                            <Fade in={!!searchTerm.length}>
                                <InputAdornment position="end">
                                    <IconButton edge="end" onClick={handleClearSearch}>
                                        <ClearIcon fontSize="small" color="disabled" />
                                    </IconButton>
                                </InputAdornment>
                            </Fade>
                        ),
                    }}
                />
                {!hideEnterHint && (
                    <Fade in={!!searchTerm.length && !isSearching}>
                        <span style={{ color: '#676767' }}>Press enter to search</span>
                    </Fade>
                )}
            </Stack>
            <Button onClick={submitSearch}>
                <SearchIcon color={isSearching ? 'secondary' : searchTerm.length ? 'primary' : 'disabled'} />
            </Button>
        </Stack>
    );
};

export default Searchbox;
