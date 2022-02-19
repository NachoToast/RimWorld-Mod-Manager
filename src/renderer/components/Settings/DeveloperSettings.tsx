import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import JsonIcon from '../Util/JsonIcon';

const DeveloperSettings = () => {
    return (
        <Box>
            <FormGroup>
                <FormControlLabel
                    control={<Switch />}
                    label={
                        <span>
                            Include <JsonIcon open={false} callback={() => null} /> button in mod preview
                        </span>
                    }
                />
                <FormControlLabel control={<Switch />} label="Show raw JSON in mod preview by default" />
            </FormGroup>
        </Box>
    );
};

export default DeveloperSettings;
