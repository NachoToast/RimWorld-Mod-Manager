import { Stack, TablePagination } from '@mui/material';
import React from 'react';
import { PageChangeFunction, PerPageChangeFunction } from '../../../../hooks/useModPagination';
import './LibraryNavBar.css';
import Searchbox from '../../../Searchbox';

interface LibraryNavBarProps {
    numPages: number;
    page: number;
    perPage: number;
    handlePageChange: PageChangeFunction;
    handlePerPageChange: PerPageChangeFunction;
}

const LibraryNavBar = (props: LibraryNavBarProps) => {
    const { page, perPage, numPages, handlePageChange, handlePerPageChange } = props;

    return (
        <Stack className="libraryNavBar" direction="row">
            <TablePagination
                component="div"
                count={numPages}
                page={page}
                rowsPerPage={perPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handlePerPageChange}
                labelRowsPerPage="Mods per page:"
            />
            <Searchbox />
        </Stack>
    );
};

export default LibraryNavBar;
