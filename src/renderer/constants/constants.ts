import { FilePaths } from '../../types/ModFiles';

export const storageKeys: { [K in FilePaths]: string } = {
    workshop: 'workshopModsFilePath',
    local: 'localModsFilePath',
    modlist: 'modConfigFilePath',
};

export const pathDefaults: { [K in FilePaths]: string } = {
    workshop: 'C:\\Program Files (x86)\\Steam\\steamapps\\workshop\\content\\294100',
    local: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RimWorld\\Mods',
    modlist: '%appdata%\\..\\LocalLow\\Ludeon Studios\\RimWorld by Ludeon Studios\\Config',
};
