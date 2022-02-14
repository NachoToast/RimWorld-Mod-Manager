import React, { useMemo } from 'react';
import { ModList, ModSource } from '../../../types/ModFiles';
import { FixedSizeList } from 'react-window';
import ModRow from './ModRow';

const VirtualModList = ({ mods }: { mods: ModList<ModSource> }) => {
    // sort by folder name to emulate order in file
    const packageIds = useMemo(
        () => Object.keys(mods).sort((a, b) => Number(mods[a].folderName) - Number(mods[b].folderName)),
        [mods],
    );

    const row = (props: { index: number; style: React.CSSProperties }) => {
        const { index } = props;
        const mod = mods[packageIds[index]];

        return <ModRow {...props} mod={mod} />;
    };

    const maxHeight = useMemo(() => Math.min(600, 50 * packageIds.length), [packageIds.length]);

    return (
        <FixedSizeList height={maxHeight} width="100%" itemSize={46} itemCount={packageIds.length} overscanCount={5}>
            {row}
        </FixedSizeList>
    );
};

export default VirtualModList;
