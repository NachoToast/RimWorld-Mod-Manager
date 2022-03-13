import { Stack } from '@mui/material';
import React from 'react';

const PreviewImageCarousel = ({ images }: { images: string[] }) => {
    if (images.length === 0) return <></>;
    if (images.length === 1) return <img src={images[0]} style={{ maxHeight: '100%', alignSelf: 'center' }} />;

    return (
        <Stack
            direction="column"
            spacing={1}
            sx={{ maxHeight: '100%', overflow: 'auto' }}
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            {images.map((src, index) => (
                <img src={src} key={index} style={{ maxHeight: '100%' }} />
            ))}
        </Stack>
    );
};

export default PreviewImageCarousel;
