import { Tooltip } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getRimWorldVersion } from '../../redux/slices/main.slice';

const VersionLabel = () => {
    const version = useSelector(getRimWorldVersion);

    if (version) {
        return (
            <Tooltip title={`${version.major} ${version.minor} ${version.rev}`}>
                <div style={{ position: 'absolute', top: 0, left: '0.5rem', color: 'gray' }}>
                    RimWorld {version.major}
                </div>
            </Tooltip>
        );
    } else return <></>;
};

export default VersionLabel;
