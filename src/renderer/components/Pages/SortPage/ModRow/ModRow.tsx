import React, { createRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Mod, PackageId } from '../../../../../types/ModFiles';
import useDragReodering from '../../../../hooks/useDragDrop';
import { setFocussedMod } from '../../../../redux/slices/main';
import './ModRow.css';

const ModRow = ({ mod, isInModList, packageId }: { mod?: Mod; packageId: PackageId; isInModList?: boolean }) => {
    const dispatch = useDispatch();

    const handleSelect = useCallback(() => {
        if (mod) dispatch(setFocussedMod(mod));
    }, [dispatch, mod]);

    const ref = createRef<HTMLSpanElement>();

    const handlers = useDragReodering({ mod, packageId, isInModList: !!isInModList, ref });

    return (
        <span ref={ref} onClick={handleSelect} className="modRow noSelect" {...handlers}>
            {mod?.name || packageId}
        </span>
    );
};

export default ModRow;
