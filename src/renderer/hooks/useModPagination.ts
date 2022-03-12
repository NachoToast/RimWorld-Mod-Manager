import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFilteredModLibrary } from '../redux/slices/modLibrary';

export type PageChangeFunction = (e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
export type PerPageChangeFunction = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface UseModPaginationReturn {
    handlePageChange: PageChangeFunction;
    handlePerPageChange: PerPageChangeFunction;
    page: number;
    perPage: number;
    numPages: number;
}

function useModPagination(): UseModPaginationReturn {
    const mods = useSelector(getFilteredModLibrary);

    const [page, setPage] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(25);

    const numPages = useMemo<number>(() => Object.keys(mods).length, [mods]);

    const handlePageChange = useCallback<PageChangeFunction>((e, newPage) => {
        setPage(newPage);
    }, []);

    const handlePerPageChange = useCallback<PerPageChangeFunction>((e) => {
        setPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }, []);

    return { page, perPage, numPages, handlePageChange, handlePerPageChange };
}

export default useModPagination;
