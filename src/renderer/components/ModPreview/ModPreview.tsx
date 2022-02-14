import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentMod } from '../../redux/slices/main.slice';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { Mod, ModSource } from '../../../types/ModFiles';
import LinkIcon from '../Util/LinkIcon';

const ModPreview = () => {
    const mod = useSelector(getCurrentMod);

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

    return (
        <Stack height={800} sx={{ overflowY: 'auto' }}>
            <Typography variant="h6" textAlign="center">
                {mod.name}
            </Typography>
            <Stack sx={{ width: '100%' }} direction="row" justifyContent="space-between">
                <Typography textAlign="left">{mod.authors.join(', ')}</Typography>
                <Typography textAlign="right" color="gray">
                    {mod.packageId}
                </Typography>
            </Stack>
            <img src={mod.previewImage || undefined} style={{ maxWidth: '100%', alignSelf: 'center' }} />
            <Stack direction="column">
                {Object.keys(mod)
                    .filter(
                        (e) => !['name', 'authors', 'packageId', 'folderName', 'previewImage', 'source'].includes(e),
                    )
                    .map((key, index) => {
                        const k = key as keyof Mod<ModSource>;
                        return (
                            <span key={index}>
                                {key}: {JSON.stringify(mod[k], undefined, 4)}
                            </span>
                        );
                    })}
            </Stack>
            <Stack direction="row">
                {mod.url && <LinkIcon link={mod.url} />}
                {mod.steamWorkshopURL && <LinkIcon link={mod.steamWorkshopURL} />}
            </Stack>
        </Stack>
    );
};

export default ModPreview;
