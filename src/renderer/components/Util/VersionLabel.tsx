import { Tooltip } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getRimWorldVersion, getRimWorldVersionOverride } from '../../redux/slices/main.slice';

const VersionLabel = () => {
    const { native: version } = useSelector(getRimWorldVersion);
    const override = useSelector(getRimWorldVersionOverride);

    if (version) {
        return (
            <Tooltip title={`${override ? 'Overriding ' : ''}${version.major} ${version.minor} ${version.rev}`}>
                <span style={{ color: 'gray' }}>RimWorld {override || version.major}</span>
            </Tooltip>
        );
    } else return <></>;
};

export default VersionLabel;
