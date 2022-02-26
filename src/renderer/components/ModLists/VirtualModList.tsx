import React, { useMemo } from 'react';
import { Mod, ModSource } from '../../../types/ModFiles';
import { FixedSizeList } from 'react-window';
import ModRow from './ModRow';

const VirtualModList = ({ mods }: { mods: Mod<ModSource>[] }) => {
    const row = (props: { index: number; style: React.CSSProperties }) => {
        return <ModRow {...props} mod={mods[props.index]} />;
    };

    const maxHeight = useMemo(() => Math.min(800, 50 * mods.length), [mods.length]);

    return (
        <FixedSizeList height={maxHeight} width="100%" itemSize={46} itemCount={mods.length} overscanCount={5}>
            {row}
        </FixedSizeList>
    );
};

export default VirtualModList;
