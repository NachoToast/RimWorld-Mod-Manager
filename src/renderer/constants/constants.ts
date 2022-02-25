import { FilePath, ModSource, PackageId } from '../../types/ModFiles';

export const filePathStorageKeys: { [K in FilePath]: string } = {
    workshop: 'workshopModsFilePath',
    local: 'localModsFilePath',
    modlist: 'modConfigFilePath',
    core: 'coreModsFilePath',
};

export const pathDefaults: { [K in FilePath]: string } = {
    workshop: 'C:\\Program Files (x86)\\Steam\\steamapps\\workshop\\content\\294100',
    local: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RimWorld\\Mods',
    modlist:
        'C:\\Users\\USERNAME\\AppData\\LocalLow\\Ludeon Studios\\RimWorld by Ludeon Studios\\Config\\ModsConfig.xml',
    core: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RimWorld\\Data',
};

export const defaultModSourceOverrides: { [index: PackageId]: ModSource } = {
    'unlimitedhugs.hugslib': 'core',
    'brrainz.harmony': 'core',
    'erdelf.humanoidalienraces': 'core',
};

export const otherStorageKeys = {
    modSourceOverrides: 'modSourceOverrides',
    modGrouping: 'modGrouping',
};

export const fallBackVersion = 1.3;
