import { Tooltip } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentList } from '../../redux/slices/listManager.slice';

const CurrentlySelected = () => {
    const currentList = useSelector(getCurrentList);

    const name = useMemo(() => currentList?.name || 'Unknown List', [currentList?.name]);

    const description = useMemo(() => currentList?.description ?? '', [currentList?.description]);

    return (
        <Tooltip title={description}>
            <span style={{ color: 'gray' }}>
                Editing <span style={{ color: 'pink' }}>{name}</span>
            </span>
        </Tooltip>
    );
};

export default CurrentlySelected;
