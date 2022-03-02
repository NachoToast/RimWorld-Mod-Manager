import React from 'react';
import useSteamLinkOverriding from '../../../../hooks/useSteamLinkOverriding';
import { ModSource, Mod } from '../../../../../types/ModFiles';
import Link from '@mui/material/Link';

interface InlineLinkProps {
    decoratedHref: string;
    decoratedText: string;
    mod: Mod<ModSource>;
}

const InlineLink = ({ decoratedHref, decoratedText, mod }: InlineLinkProps) => {
    const finalLink = useSteamLinkOverriding(decoratedHref, mod.steamWorkshopId);

    return (
        <Link target="_blank" href={finalLink} rel="noopener">
            {decoratedText}
        </Link>
    );
};

export default InlineLink;
