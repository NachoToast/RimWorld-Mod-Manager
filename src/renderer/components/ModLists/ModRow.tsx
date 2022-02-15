import { IconButton, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentMod, setCurrentMod } from '../../redux/slices/main.slice';
import { Mod, ModSource, PackageId } from '../../../types/ModFiles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addToModList, getModList, removeFromModList } from '../../redux/slices/modManager.slice';

/** Basic List item for a mod in the active list but not in the library. */
export const UnknownModRow = (props: { index: number; style: React.CSSProperties; packageId: PackageId }) => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);

    const { index, style, packageId } = props;
    const handleRemoveFromList = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(removeFromModList(packageId));
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
                isHovered && (
                    <Tooltip title="Remove from list" placement="left">
                        <IconButton onClick={handleRemoveFromList}>
                            <RemoveIcon />
                        </IconButton>
                    </Tooltip>
                )
            }
        >
            <Tooltip title="Unable to find file" placement="left" arrow>
                <ListItemButton sx={{ maxWidth: '100%' }}>
                    <ListItemText primary={packageId} />
                </ListItemButton>
            </Tooltip>
        </ListItem>
    );
};

const ModRow = (props: { index: number; style: React.CSSProperties; mod: Mod<ModSource> }) => {
    const dispatch = useDispatch();
    const currentMod = useSelector(getCurrentMod);
    const modList = useSelector(getModList);
    const [isHovered, setIsHovered] = useState(false);

    const { index, style, mod } = props;

    const isInModList = useMemo(() => !!modList.lookup[mod.packageId.toLowerCase()], [modList, mod]);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (currentMod === mod) dispatch(setCurrentMod(null));
        else dispatch(setCurrentMod(mod));
    };

    const handleAddToList = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isInModList) dispatch(removeFromModList(mod.packageId));
        else dispatch(addToModList({ packageId: mod.packageId }));
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
                isHovered && (
                    <Tooltip title={isInModList ? 'Remove from list' : 'Add to list'} placement="left">
                        <IconButton onClick={handleAddToList}>{isInModList ? <RemoveIcon /> : <AddIcon />}</IconButton>
                    </Tooltip>
                )
            }
        >
            <ListItemButton sx={{ maxWidth: '100%' }} onClick={handleClick}>
                <ListItemText primary={mod.name} />
            </ListItemButton>
        </ListItem>
    );
};

export default ModRow;
