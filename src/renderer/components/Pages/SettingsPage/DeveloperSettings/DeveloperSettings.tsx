import { FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack, Switch } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supportedLocales } from '../../../../constants';
import { getConfig, setConfigOption } from '../../../../redux/slices/main';
import JsonIcon from '../../../Buttons/ViewRawButton';

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
            <Stack direction="row" spacing={1} alignItems="flex-end">
                <FormControl variant="standard">
                    <InputLabel id="locale-select-label">Locale</InputLabel>
                    <Select
                        labelId="locale-select-label"
                        id="locale-select"
                        value={config.locale}
                        onChange={(e) => dispatch(setConfigOption({ key: 'locale', value: e.target.value }))}
                    >
                        {supportedLocales.map((e, i) => (
                            <MenuItem value={e} key={i}>
                                {e}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <span style={{ color: 'gray' }}>(e.g {new Date().toLocaleDateString(config.locale)})</span>
            </Stack>
        </Box>
    );
};

export default DeveloperSettings;
