import { Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { Mod, ModSource } from '../../../types/ModFiles';
import { getCurrentModList } from '../../redux/slices/main.slice';
import ModRow from './ModRow';

/** A list of the mods in the currently selected mod list, i.e. `ModsConfig.xml` */
const ActiveModList = () => {
    const list = useSelector(getCurrentModList);

    if (!list) return <></>;
    else if (typeof list === 'string') return <div>{list}</div>;
    else return <ValidModList list={list} />;
};

const ValidModList = ({ list }: { list: Mod<ModSource>[] }) => {
    const maxHeight = useMemo(() => Math.min(600, 50 * list.length), [list.length]);

    const row = (props: { index: number; style: React.CSSProperties }) => {
        const { index } = props;

        return <ModRow {...props} mod={list[index]} />;
    };

    return (
        <Stack height={800} sx={{ overflowY: 'auto' }}>
            <Typography>Active Mods</Typography>
            <FixedSizeList height={maxHeight} width="100%" itemSize={46} itemCount={list.length} overscanCount={5}>
                {row}
            </FixedSizeList>
        </Stack>
    );
};

export default ActiveModList;
