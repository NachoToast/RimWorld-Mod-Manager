import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getRimWorldVersion,
    getRimWorldVersionOverride,
    setRimWorldVersionOverride,
} from '../../redux/slices/main.slice';

const possibleVersions = [1, 1.1, 1.2, 1.3];

const VersionOverride = () => {
    const dispatch = useDispatch();
    const versionOverride = useSelector(getRimWorldVersionOverride);
    const version = useSelector(getRimWorldVersion);

    const handleChange = (e: SelectChangeEvent) => {
        e.preventDefault();
        const newVersion = Number(e.target.value);
        if (newVersion === version?.major) {
            dispatch(setRimWorldVersionOverride(null));
        } else dispatch(setRimWorldVersionOverride(newVersion));
    };

    const value = useMemo(() => {
        if (versionOverride) return versionOverride.toString();
        else if (version?.major) return version.major.toString();
        else return 'None';
    }, [version?.major, versionOverride]);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                RimWorld Version
            </Typography>
            <FormControl>
                <InputLabel id="override-select-label">Version</InputLabel>
                <Select
                    labelId="override-select-label"
                    value={value}
                    label="Version"
                    onChange={handleChange}
                    sx={{ minWidth: '135px' }}
                >
                    {possibleVersions.map((v, index) => (
                        <MenuItem key={index} value={v}>
                            {v === version?.major ? `${v} (default)` : v}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default VersionOverride;
