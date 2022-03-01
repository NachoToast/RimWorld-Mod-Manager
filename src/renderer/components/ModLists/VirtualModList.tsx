import React, { useMemo } from 'react';
import { Mod, ModSource } from '../../../types/ModFiles';
import { FixedSizeList } from 'react-window';
import ModRow from './ModRow';
import useRemainingSize from '../../hooks/useRemainingSize';

const VirtualModList = ({ mods }: { mods: Mod<ModSource>[] }) => {
    const row = (props: { index: number; style: React.CSSProperties }) => {
        return <ModRow {...props} mod={mods[props.index]} />;
    };

    const maxHeight = useRemainingSize();

    const height = useMemo(() => Math.min(maxHeight - 50, 50 * mods.length), [maxHeight, mods.length]);

    return (
        <FixedSizeList height={height} width="100%" itemSize={46} itemCount={mods.length} overscanCount={5}>
            {row}
        </FixedSizeList>
    );
};

export default VirtualModList;
