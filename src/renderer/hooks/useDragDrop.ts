import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mod, PackageId } from '../../types/ModFiles';
import { addModsToSelectedList, getSelectedList } from '../redux/slices/listManager';

export interface UseDragReorderingProps {
    mod?: Mod;
    packageId: PackageId;
    isInModList: boolean;
    ref: React.RefObject<HTMLSpanElement>;
}

export interface UseDragReorderingReturn {
    onDragStart: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    draggable: true;
}

/** Does cool math for dragging and dropping mods to rearrange them. */
function useDragReodering({ mod, packageId, isInModList, ref }: UseDragReorderingProps): UseDragReorderingReturn {
    const dispatch = useDispatch();
    const selectedList = useSelector(getSelectedList);

    const listIndex = useMemo<number>(
        () => selectedList?.mods.indexOf(packageId.toLowerCase()) ?? -1,
        [packageId, selectedList?.mods],
    );

    const onDragStart = useCallback(
        (e: React.DragEvent) => {
            e.dataTransfer.setData('text/plain', packageId.toLowerCase());
        },
        [packageId],
    );

    const [half, setHalf] = useState<'Above' | 'Below' | undefined>(undefined);

    useEffect(() => {
        const element = ref.current;
        if (half && element) {
            console.log(half);
            element.classList.add('draggedOver', half);

            return () => {
                element.classList.remove('draggedOver', half);
            };
        }
    }, [half, ref]);

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            const element = ref.current;
            if (!isInModList || !element) return;

            let insertIndex = listIndex;
            if (insertIndex === -1) {
                console.error(`Mod ${mod?.name || packageId} not in current list, no clue where to put it`);
                return;
            }

            if (!half) console.warn(`Half undefined for drop on ${mod?.name || packageId}`);

            if (half === 'Below') insertIndex += 1;

            const id = e.dataTransfer.getData('text/plain');

            dispatch(
                addModsToSelectedList({
                    startIndex: insertIndex,
                    packageIds: [id],
                }),
            );

            setHalf(undefined);
        },
        [dispatch, half, isInModList, listIndex, mod?.name, packageId, ref],
    );

    const onDragOver = useCallback(
        (e: React.DragEvent) => {
            if (!isInModList) return;
            e.preventDefault();

            const element = ref.current;
            if (!element) return;
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;
            const elementMiddle = (elementTop + elementBottom) / 2;
            const eventPos = e.clientY;
            const newHalf: 'Above' | 'Below' = eventPos > elementMiddle ? 'Below' : 'Above';

            if (half !== newHalf) setHalf(newHalf);
        },
        [half, isInModList, ref],
    );

    const onDragLeave = useCallback(
        (e: React.DragEvent) => {
            if (!isInModList || !half) return;
            e.preventDefault();
            setHalf(undefined);
        },
        [half, isInModList],
    );

    return { onDragStart, onDrop, onDragOver, onDragLeave, draggable: true };
}

export default useDragReodering;
