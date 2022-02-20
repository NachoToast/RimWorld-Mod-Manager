import { Link, Stack, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { getRimWorldVersion, getRimWorldVersionOverride } from '../../redux/slices/main.slice';
import { ModSource, Mod } from '../../../types/ModFiles';
import Linkify from 'react-linkify';

const ImageCarousel = ({ images }: { images: string[] }) => {
    if (images.length === 0) return <></>;
    if (images.length === 1)
        return <img src={images[0]} style={{ maxWidth: '100%', maxHeight: 400, alignSelf: 'center' }} />;

    return (
        <Stack
            id="mod-preview-image-carousel"
            direction="row"
            spacing={1}
            sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 400 }}
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            {images.map((src, index) => (
                <img src={src} key={index} style={{ maxHeight: '100%' }} />
            ))}
        </Stack>
    );
};

const ModDescription = ({ mod }: { mod: Mod<ModSource> }) => {
    const rimWorldVersion = useSelector(getRimWorldVersion);
    const overridenVersion = useSelector(getRimWorldVersionOverride);
    const finalVersion = overridenVersion ?? rimWorldVersion?.major ?? 0;

    return (
        <div>
            <Typography variant="h6" textAlign="center">
                {mod.name}
            </Typography>
            <Stack sx={{ width: '100%' }} direction="row" justifyContent="space-between">
                <Typography textAlign="left">{mod.authors.join(', ')}</Typography>
                <Typography textAlign="right" color="gray">
                    {mod.packageId}
                </Typography>
            </Stack>
            <Stack sx={{ width: '100%', maxHeight: 400 }} direction="row" justifyContent="center">
                <ImageCarousel images={mod.previewImages} />
            </Stack>
            <span>
                Supported Versions ({mod.supportedVersions.length}):{' '}
                {mod.supportedVersions.map((version, index) => (
                    <span key={index} style={{ color: version === finalVersion ? 'lightgreen' : 'gray' }}>
                        {version === 1 ? '1.0' : version}
                        <span>{', '}</span>
                    </span>
                ))}
                <br />
            </span>
            <div style={{ whiteSpace: 'pre-wrap' }}>
                <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                        <Link target="_blank" href={decoratedHref} key={key} rel="noopener">
                            {decoratedText}
                        </Link>
                    )}
                >
                    {mod.description}
                </Linkify>
            </div>
        </div>
    );
};

export default ModDescription;
