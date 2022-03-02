import { Stack, StackProps } from '@mui/material';
import React from 'react';

/** Container for labels and other elements to be positioned in the top-left of the window. */
const TopLeftBox = ({ props, children }: { props?: StackProps; children: JSX.Element | JSX.Element[] }) => {
    return (
        <Stack {...props} style={{ position: 'absolute', top: 0, left: '0.5rem', zIndex: '1000' }}>
            {children}
        </Stack>
    );
};

export default TopLeftBox;
