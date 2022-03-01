import Config from '../../types/Config';

/** Prepended to all keys when getting/setting items in local storage. */
export const storageKeyPrefix = 'rmm.';

export const supportedLocales: string[] = ['en-NZ', 'en-US'];

export const defaultList = {
    name: 'Default List',
    description: 'Mods loaded in from ModsConfig.xml',
};

export const defaultConfig: Config = {
    filePaths: {
        workshop: 'C:\\Program Files (x86)\\Steam\\steamapps\\workshop\\content\\294100',
        local: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RimWorld\\Mods',
        modlist:
            'C:\\Users\\USERNAME\\AppData\\LocalLow\\Ludeon Studios\\RimWorld by Ludeon Studios\\Config\\ModsConfig.xml',
        core: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RimWorld\\Data',
    },
    modSourceOverrides: {
        'unlimitedhugs.hugslib': 'core',
        'brrainz.harmony': 'core',
        'erdelf.humanoidalienraces': 'core',
    },
    rimWorldVersion: {
        fallback: 1.3,
        native: null,
        knownExpansions: null,
        overriden: null,
        overrideOptions: [1, 1.1, 1.2, 1.3, 1.4],
    },
    modGrouping: 'source',
    config: {
        viewRawButtonInPreview: false,
        showRawJsonByDefault: false,
        openSteamInBrowser: false,
        locale: 'en-NZ',
    },
};
