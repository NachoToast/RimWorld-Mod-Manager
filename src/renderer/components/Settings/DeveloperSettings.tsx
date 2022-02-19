import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigOptions, getConfig, setBooleanOption } from '../../redux/slices/config.slice';
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
                            checked={config.booleanDefaultOff[ConfigOptions.ViewRawPreviewButton]}
                            onChange={(e) =>
                                dispatch(
                                    setBooleanOption({
                                        key: ConfigOptions.ViewRawPreviewButton,
                                        value: e.target.checked,
                                    }),
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
                            checked={config.booleanDefaultOff[ConfigOptions.RawJsonPreviewDefault]}
                            onChange={(e) =>
                                dispatch(
                                    setBooleanOption({
                                        key: ConfigOptions.RawJsonPreviewDefault,
                                        value: e.target.checked,
                                    }),
                                )
                            }
                        />
                    }
                    label="Show raw JSON in mod preview by default"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={config.booleanDefaultOff[ConfigOptions.OpenWorkshopLinksInBrowser]}
                            onChange={(e) =>
                                dispatch(
                                    setBooleanOption({
                                        key: ConfigOptions.OpenWorkshopLinksInBrowser,
                                        value: e.target.checked,
                                    }),
                                )
                            }
                        />
                    }
                    label="Steam workshop links should open in browser instead of Steam app"
                />
            </FormGroup>
        </Box>
    );
};

export default DeveloperSettings;
