import { readFileSync } from 'fs';
import { PackageId } from '../../types/ModFiles';
import { convert, u2a, xmlStringToDocument } from './modLoader';
import { userInfo } from 'os';

const user = userInfo().username;

interface ModsConfigXML {
    /** @example '1.3.3200 rev726' */
    version: string;

    activeMods: PackageId[] | PackageId;

    knownExpansions?: PackageId[] | PackageId;
}

export interface RimWorldVersion {
    /** @example 1.2, 1.3 */
    major: number;
    /** @example 3200 */
    minor: number;
    /** @example 'rev726' */
    rev: string;

    /** @example '1.3.3200 rev726' */
    full: string;
}

export interface ModsConfig {
    version: RimWorldVersion;
    activeMods: PackageId[];
    knownExpansions: PackageId[];
}

function main(path: string): ModsConfig {
    path = path.replace('USERNAME', user);
    const rawConfig = readFileSync(path, 'utf-8');

    const document = xmlStringToDocument(rawConfig);
    if (!document) throw new Error('ModsConfig.xml file has invalid XML content');

    const rawObject = convert<ModsConfigXML, 'ModsConfigData'>(document);
    if (!rawObject) throw new Error('Error parsing ModsConfig.xml');

    const { version, activeMods, knownExpansions } = rawObject.ModsConfigData;

    const [versionA, rev] = version.split(' ');
    const [majorA, majorB, minor] = versionA.split('.');

    const output: ModsConfig = {
        version: {
            major: Number(`${majorA}.${majorB}`),
            minor: Number(minor),
            rev,
            full: version,
        },
        activeMods: u2a(activeMods).filter((e) => !!e),
        knownExpansions: knownExpansions ? u2a(knownExpansions) : [],
    };
    return output;
}

export default main;
