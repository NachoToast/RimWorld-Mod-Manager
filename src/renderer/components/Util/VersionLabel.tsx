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
                <div style={{ position: 'absolute', top: 0, left: '0.5rem', color: 'gray', zIndex: '1000' }}>
                    RimWorld {override || version.major}
                </div>
            </Tooltip>
        );
    } else return <></>;
};

export default VersionLabel;
