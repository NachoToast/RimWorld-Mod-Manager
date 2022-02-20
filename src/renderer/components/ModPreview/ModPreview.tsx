import { Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentMod } from '../../redux/slices/main.slice';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { Mod, ModSource } from '../../../types/ModFiles';
import LinkIcon from '../Util/LinkIcon';
import OpenIcon from '../Util/OpenIcon';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import JsonIcon from '../Util/JsonIcon';
import { ConfigOptions, getConfig } from '../../redux/slices/config.slice';
import ModDescription from './ModDescription';

const ButtonBar = ({
    mod,
    rawMode,
    handleToggleRawMode,
}: {
    mod: Mod<ModSource>;
    handleToggleRawMode: (e: React.MouseEvent) => void;
    rawMode: boolean;
}) => {
    const config = useSelector(getConfig);

    return (
        <Stack direction="row">
            {mod.url && <LinkIcon link={mod.url} />}
            {mod.steamWorkshopURL && <LinkIcon link={mod.steamWorkshopURL} />}
            <OpenIcon icon={<FolderOpenIcon />} title="Open mod folder" link={mod.folderPath} />
            {config.booleanDefaultOff[ConfigOptions.ViewRawPreviewButton] && (
                <JsonIcon callback={handleToggleRawMode} open={rawMode} />
            )}
        </Stack>
    );
};

const ModPreview = () => {
    const mod = useSelector(getCurrentMod);
    const config = useSelector(getConfig);

    const [rawMode, setRawMode] = useState<boolean>(config.booleanDefaultOff[ConfigOptions.RawJsonPreviewDefault]);

    const handleToggleRawMode = () => {
        setRawMode(!rawMode);
    };

    if (!mod)
        return (
            <Stack
                sx={{
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                spacing={1}
            >
                <PlagiarismIcon color="disabled" sx={{ fontSize: '64px' }} />
                <Typography variant="h5" color="gray">
                    Select a mod to preview
                </Typography>
            </Stack>
        );

    if (rawMode)
        return (
            <Stack height={800} sx={{ overflowY: 'auto' }}>
                <pre>{JSON.stringify(mod, undefined, 4)}</pre>
                <ButtonBar mod={mod} handleToggleRawMode={handleToggleRawMode} rawMode={true} />
            </Stack>
        );

    return (
        <Stack height={800} sx={{ overflowY: 'auto' }}>
            <ModDescription mod={mod} />
            <ButtonBar mod={mod} handleToggleRawMode={handleToggleRawMode} rawMode={false} />
        </Stack>
    );
};

export default ModPreview;
