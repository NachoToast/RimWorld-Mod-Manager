import React, { useCallback } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getSettingsOpen, setSettingsOpen } from '../../../redux/slices/main';

const SettingsButton = () => {
    const dispatch = useDispatch();
    const settingsOpen = useSelector(getSettingsOpen);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            dispatch(setSettingsOpen(!settingsOpen));
        },
        [dispatch, settingsOpen],
    );

    return (
        <Tooltip title={<>{settingsOpen ? 'Close' : 'Open'} Settings</>}>
            <Button sx={{ position: 'fixed', right: 0, zIndex: '1000' }} onClick={handleClick}>
                <SettingsIcon fontSize="large" color={settingsOpen ? 'primary' : 'disabled'} />
            </Button>
        </Tooltip>
    );
};

export default SettingsButton;
