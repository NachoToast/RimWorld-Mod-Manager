import { Checkbox, IconButton, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentMod } from '../../redux/slices/main.slice';
import { Mod, ModSource, PackageId } from '../../../types/ModFiles';
import RemoveIcon from '@mui/icons-material/Remove';
import { addToModList, getModList, removeFromModList } from '../../redux/slices/modManager.slice';
import './ModRow.css';
import useRimWorldVersion from '../Util/useRimWorldVersion';

/** Basic List item for a mod in the active list but not in the library. */
export const UnknownModRow = (props: { index: number; style: React.CSSProperties; packageId: PackageId }) => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);

    const { index, style, packageId } = props;
    const handleRemoveFromList = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(removeFromModList([packageId]));
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
    const modList = useSelector(getModList);
    const version = useRimWorldVersion();

    const { index, style, mod } = props;

    const isInModList = useMemo(() => !!modList.lookup[mod.packageId.toLowerCase()], [modList, mod]);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(setCurrentMod(mod));
    };

    const handleAddToList = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInModList) dispatch(removeFromModList([mod.packageId]));
        else dispatch(addToModList({ packageIds: [mod.packageId], version }));
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', mod.packageId);
    };

    return (
        <div
            className="modRow noselect"
            key={index}
            style={style}
            onClick={handleClick}
            onDragStart={handleDragStart}
            draggable
        >
            <Checkbox disableRipple tabIndex={-1} edge="start" checked={isInModList} onClick={handleAddToList} />
            {mod.name}
        </div>
    );

    // mui stuff was laggy, especially when scrolling via the scrollbar
    // return (
    //     <ListItem
    //         style={style}
    //         key={index}
    //         component="div"
    //         disablePadding
    //         sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
    //     >
    //         <ListItemButton sx={{ maxWidth: '100%' }} onClick={handleClick}>
    //             {/* <ListItemIcon>
    //                 <Fade in={false}>
    //                     <Checkbox
    //                         disableRipple
    //                         tabIndex={-1}
    //                         edge="start"
    //                         checked={isInModList}
    //                         onClick={handleAddToList}
    //                     />
    //                 </Fade>
    //             </ListItemIcon> */}
    //             <ListItemText primary={mod.name} />
    //         </ListItemButton>
    //     </ListItem>
    // );
};

export default ModRow;
