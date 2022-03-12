import { Fade, ImageListItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Mod, ModSource } from '../../../../../types/ModFiles';
import mogus from '../../../../assets/Amogus.png';
import ModDescription from '../../../ModDescription';
import './ModTile.css';

const ModTile = ({ mod }: { mod: Mod<ModSource> }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const [fadeIn, setFadeIn] = useState<boolean>(false);

    useEffect(() => {
        const delay = Math.floor(Math.random() * 301); // 0 to 300 (inclusive)

        const timeout = setTimeout(() => setFadeIn(true), delay);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Fade in={fadeIn}>
            <span
                style={{ position: 'relative' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <ImageListItem sx={{ width: '100%' }}>
                    <Fade in={isHovered}>
                        <div className="modTile noSelect">
                            <Typography variant="h4">{mod.name}</Typography>
                            {isHovered && (
                                <Typography component="div">
                                    <ModDescription mod={mod} />
                                </Typography>
                            )}
                        </div>
                    </Fade>
                    <img loading="lazy" src={mod.previewImages.at(0) ?? mogus} />
                </ImageListItem>
            </span>
        </Fade>
    );
};

export default ModTile;
