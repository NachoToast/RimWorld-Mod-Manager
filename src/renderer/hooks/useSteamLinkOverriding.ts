import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getConfig } from '../redux/slices/main';

function useSteamLinkOverriding(link: string, workshopId?: string | null) {
    const { openSteamInBrowser } = useSelector(getConfig);

    const [overridenLink, setOverridenLink] = useState<string>('');

    useEffect(() => {
        if (link.includes('steam')) {
            // convert steam browser links to steam workshop links if configured
            if (!openSteamInBrowser) {
                const id = link.split('/').at(-1);
                if (id) setOverridenLink(`steam://url//CommunityFilePage/${workshopId || id}`);
            } else setOverridenLink('');
        }
    }, [link, openSteamInBrowser, workshopId]);

    return overridenLink;
}

export default useSteamLinkOverriding;
