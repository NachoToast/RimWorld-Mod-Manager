import Stack from '@mui/material/Stack';
import React from 'react';

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

export default ImageCarousel;
