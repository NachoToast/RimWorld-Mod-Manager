import { ImageList, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Mod, ModSource } from '../../../../types/ModFiles';
import useModPagination from '../../../hooks/useModPagination';
import { getFilteredModLibrary } from '../../../redux/slices/modLibrary';
import LibraryNavBar from './Navbar';
import ModTile from './ModTile';

const BrowsePage = () => {
    const mods = useSelector(getFilteredModLibrary);
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));
    const xl = useMediaQuery(theme.breakpoints.up('xl'));

    const paginationProps = useModPagination();
    const { page, perPage } = paginationProps;

    const cols = useMemo<number>(() => {
        if (xl) return 5;
        else if (lg) return 4;
        else if (md) return 3;
        else return 2;
    }, [lg, md, xl]);

    const visibleMods = useMemo<Mod<ModSource>[]>(() => {
        return Object.values(mods).slice(page * perPage, (page + 1) * perPage);
    }, [mods, page, perPage]);

    return (
        <>
            <LibraryNavBar {...paginationProps} />
            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                <ImageList variant="masonry" cols={cols} gap={8} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {visibleMods.map((e, i) => (
                        <ModTile key={`${e.packageId}-${i}`} mod={e} />
                    ))}
                </ImageList>
            </div>
        </>
    );
};

export default BrowsePage;
