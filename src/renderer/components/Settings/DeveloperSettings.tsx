import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig, setConfigOption } from '../../redux/slices/main.slice';
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
                            checked={config.viewRawButtonInPreview}
                            onChange={(e) =>
                                dispatch(setConfigOption({ key: 'viewRawButtonInPreview', value: e.target.checked }))
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
                            checked={config.showRawJsonByDefault}
                            onChange={(e) =>
                                dispatch(
                                    setConfigOption({
                                        key: 'showRawJsonByDefault',
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
                            checked={config.openSteamInBrowser}
                            onChange={(e) =>
                                dispatch(
                                    setConfigOption({
                                        key: 'openSteamInBrowser',
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
