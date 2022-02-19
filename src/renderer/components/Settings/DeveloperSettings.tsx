import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigOptions, getConfig, setOption } from '../../redux/slices/config.slice';
import JsonIcon from '../Util/JsonIcon';

const DeveloperSettings = () => {
    const dispatch = useDispatch();
    const config = useSelector(getConfig);

    return (
        <Box>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={config[ConfigOptions.ViewRawPreviewButton]}
                            onChange={(e) =>
                                dispatch(
                                    setOption({ key: ConfigOptions.ViewRawPreviewButton, value: e.target.checked }),
                                )
                            }
                        />
                    }
                    label={
                        <span>
                            Include <JsonIcon open={false} callback={() => null} /> button in mod preview
                        </span>
                    }
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={config[ConfigOptions.RawJsonPreviewDefault]}
                            onChange={(e) =>
                                dispatch(
                                    setOption({ key: ConfigOptions.RawJsonPreviewDefault, value: e.target.checked }),
                                )
                            }
                        />
                    }
                    label="Show raw JSON in mod preview by default"
                />
            </FormGroup>
        </Box>
    );
};

export default DeveloperSettings;
