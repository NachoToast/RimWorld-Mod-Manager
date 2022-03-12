import { useEffect, useState } from 'react';

// TODO: move this to configurable option
const openSteamInBrowser = true;

function useSteamLinkOverriding(link: string, workshopId: string | null) {
    const [overridenLink, setOverridenLink] = useState<string>('');

    useEffect(() => {
        if (link.includes('steamcommunity.com/sharedfiles/filedetails/?id=') && !openSteamInBrowser) {
            // convert steam browser links to steam workshop links if configured
            const id = link.split('/').at(-1);
            if (id) setOverridenLink(`steam://url//CommunityFilePage/${workshopId || id}`);
        } else setOverridenLink(link);
    }, [link, workshopId]);

    return overridenLink;
}

export default useSteamLinkOverriding;
