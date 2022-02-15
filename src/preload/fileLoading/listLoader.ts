import { readFileSync } from 'fs';
import { PackageId } from '../../types/ModFiles';
import { convert, xmlStringToDocument } from './modLoader';
import { userInfo } from 'os';

const user = userInfo().username;

interface ModsConfigXML {
    /** @example '1.3.3200 rev726' */
    version: string;

    activeMods: PackageId[];

    knownExpansions: PackageId[];
}

export interface ModsConfig extends Omit<ModsConfigXML, 'version'> {
    version: {
        /** @example '1.2', '1.3' */
        major: string;
        /** @example '3200' */
        minor: string;
        /** @example 'rev726' */
        rev: string;
    };
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
            major: `${majorA}.${majorB}`,
            minor,
            rev,
        },
        activeMods,
        knownExpansions,
    };
    return output;
}

export default main;
