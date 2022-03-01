import { useEffect, useState } from 'react';

/** Calculates height to take up from the remaining window minus the height of the title component. */
function useRemainingSize(initial: number = 800): number {
    const [remainingSize, setRemainingSize] = useState<number>(initial);

    const headerHeight = document.getElementById('rmm-header')?.clientHeight;

    const totalHeight = window.innerHeight;

    useEffect(() => {
        if (headerHeight !== undefined) {
            setRemainingSize(totalHeight - headerHeight - 1);
        } else {
            setRemainingSize(initial);
        }
    }, [headerHeight, initial, totalHeight]);

    return remainingSize;
}

export default useRemainingSize;
