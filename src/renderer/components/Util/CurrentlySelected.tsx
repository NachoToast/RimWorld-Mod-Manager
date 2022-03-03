import { Fade, Tooltip } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentList } from '../../redux/slices/listManager';
import { getPage } from '../../redux/slices/main';

/** Displays the name of the currently selected mod list. */
const CurrentlySelected = () => {
    const currentList = useSelector(getCurrentList);
    const page = useSelector(getPage);

    const name = useMemo(() => currentList?.name || 'Unknown List', [currentList?.name]);

    const description = useMemo(() => currentList?.description ?? '', [currentList?.description]);

    console.log(page !== 'sort');

    return (
        <Tooltip title={description}>
            <Fade in={page !== 'sort'}>
                <span style={{ color: 'gray' }}>
                    Editing <span style={{ color: 'pink' }}>{name}</span>
                </span>
            </Fade>
        </Tooltip>
    );
};

export default CurrentlySelected;
