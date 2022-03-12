import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import React, { useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch } from 'react-redux';
import { Pages, setPage } from '../../redux/slices/main';
import ListIcon from '@mui/icons-material/FormatListBulleted';

const Navbar = () => {
    const dispatch = useDispatch();

    const navigateTo = useCallback(
        (to: Pages) => {
            return () => {
                dispatch(setPage(to));
            };
        },
        [dispatch],
    );

    return (
        <Paper sx={{ width: '100%' }} elevation={3} id="bottomNav">
            <BottomNavigation showLabels>
                <BottomNavigationAction label="Browse" icon={<SearchIcon />} onClick={navigateTo(Pages.Browse)} />
                <BottomNavigationAction label="Lists" icon={<ListIcon />} onClick={navigateTo(Pages.Lists)} />
                <BottomNavigationAction label="Sort" icon={<SortIcon />} onClick={navigateTo(Pages.Sort)} />
                <BottomNavigationAction label="Settings" icon={<SettingsIcon />} onClick={navigateTo(Pages.Settings)} />
            </BottomNavigation>
        </Paper>
    );
};

export default Navbar;
