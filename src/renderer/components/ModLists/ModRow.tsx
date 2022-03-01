import { Checkbox } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentMod, setCurrentMod } from '../../redux/slices/main.slice';
import { Mod, ModSource, PackageId } from '../../../types/ModFiles';
import { addToModList, getModList, removeFromModList } from '../../redux/slices/modManager.slice';
import './ModRow.css';
import useRimWorldVersion from '../../hooks/useRimWorldVersion';

const ModRow = (props: { index: number; style: React.CSSProperties; mod: Mod<ModSource> | PackageId }) => {
    const dispatch = useDispatch();
    const currentMod = useSelector(getCurrentMod);
    const modList = useSelector(getModList);
    const version = useRimWorldVersion();

    const { index, style, mod } = props;

    const isInModList = useMemo<boolean>(() => {
        if (typeof mod !== 'string') return !!modList.lookup[mod.packageId.toLowerCase()];
        else return modList.packageIds.includes(mod.toLowerCase());
    }, [modList, mod]);

    const isInPreview = useMemo<boolean>(
        () => currentMod?.packageId === (typeof mod !== 'string' ? mod.packageId : mod),
        [currentMod?.packageId, mod],
    );

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            if (typeof mod !== 'string') dispatch(setCurrentMod(mod));
            else window.alert(`Can't find any mod installed matching '${mod}'`);
        },
        [dispatch, mod],
    );

    const handleAddToList = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const packageId = typeof mod !== 'string' ? mod.packageId : mod;

            if (isInModList) dispatch(removeFromModList([packageId]));
            else dispatch(addToModList({ packageIds: [packageId], version }));
        },
        [dispatch, isInModList, mod, version],
    );

    const handleDragStart = useCallback(
        (e: React.DragEvent) => {
            e.dataTransfer.setData('text/plain', typeof mod !== 'string' ? mod.packageId : mod);
        },
        [mod],
    );

    return (
        <div
            className={`modRow noselect${isInPreview ? ' previewed' : ''}`}
            key={index}
            style={style}
            onClick={handleClick}
            onDragStart={handleDragStart}
            draggable
        >
            <Checkbox disableRipple tabIndex={-1} edge="start" checked={isInModList} onClick={handleAddToList} />
            {typeof mod !== 'string' ? mod.name : mod}
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
