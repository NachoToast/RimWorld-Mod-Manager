import { IconButton, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentMod, setCurrentMod } from '../../redux/slices/main.slice';
import { Mod, ModSource } from '../../../types/ModFiles';
import AddIcon from '@mui/icons-material/Add';

const ModRow = (props: { index: number; style: React.CSSProperties; mod: Mod<ModSource> }) => {
    const dispatch = useDispatch();
    const currentMod = useSelector(getCurrentMod);
    const [isHovered, setIsHovered] = useState(false);

    const { index, style, mod } = props;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentMod === mod) dispatch(setCurrentMod(null));
        else dispatch(setCurrentMod(mod));
    };

    const handleAddToList = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <ListItem
            style={style}
            key={index}
            component="div"
            disablePadding
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            secondaryAction={
                isHovered ? (
                    <Tooltip title="Add to list" placement="left">
                        <IconButton onClick={handleAddToList}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                ) : undefined
            }
        >
            <ListItemButton sx={{ maxWidth: '100%' }} onClick={handleClick}>
                <ListItemText primary={mod.name} />
            </ListItemButton>
        </ListItem>
    );
};

export default ModRow;
