import { Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { getModList } from '../../redux/slices/modManager.slice';
import ModRow, { UnknownModRow } from './ModRow';

/** A list of the mods in the currently selected mod list, i.e. `ModsConfig.xml` */
const ActiveModList = () => {
    const list = useSelector(getModList);

    const { packageIds, lookup } = list;

    console.log(lookup);

    const maxHeight = useMemo(() => Math.min(600, 50 * packageIds.length), [packageIds.length]);

    const row = (props: { index: number; style: React.CSSProperties }) => {
        const mod = lookup[packageIds[props.index]];

        if (mod && !true) {
            return <ModRow {...props} mod={lookup[packageIds[props.index]]} />;
        } else {
            return <UnknownModRow {...props} packageId={packageIds[props.index]} />;
        }
    };

    return (
        <Stack height={800} sx={{ overflowY: 'auto' }}>
            <Typography textAlign="center" variant="h6">
                Active Mods ({packageIds.length})
            </Typography>
            <FixedSizeList
                height={maxHeight}
                width="100%"
                itemSize={46}
                itemCount={packageIds.length}
                overscanCount={5}
            >
                {row}
            </FixedSizeList>
        </Stack>
    );
};

export default ActiveModList;
