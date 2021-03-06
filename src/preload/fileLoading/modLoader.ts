import {
    Mod,
    AboutXML,
    RawByVersionMap,
    ModDependency,
    ModSource,
    CoreMod,
    NumericalByVersionMap,
} from '../../types/ModFiles';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

/** Forces an element to be an array. */
export function u2a<T>(arg: T | T[]): T[] {
    if (Array.isArray(arg)) return arg;
    return [arg];
}

interface LoadOperationMeta {
    /** Total number of folders and files found in specified directory (immediate-children only). */
    files: number;
    folders: number;

    missingAboutFolder: string[];
    missingAboutXML: string[];
    invalidXML: string[];

    unknownErrors: unknown[];
    errors: Error[];
}

function main<T extends ModSource>(path: string, source: ModSource): { mods: Mod<T>[]; meta: LoadOperationMeta } {
    const mods: Mod<T>[] = [];
    const meta: LoadOperationMeta = {
        files: 0,
        folders: 0,
        missingAboutFolder: [],
        missingAboutXML: [],
        invalidXML: [],
        unknownErrors: [],
        errors: [],
    };

    const allItems = readdirSync(path, 'utf-8');
    const folders = allItems.filter((e) => !e.includes('.'));
    const files = allItems.filter((e) => e.includes('.'));

    meta.files = files.length;
    meta.folders = folders.length;

    for (const folder of folders) {
        // verify mod file structure
        const modInfo = getModInfo(path, folder, meta);
        if (modInfo === null) continue;
        const { aboutFileContents, previewImages, steamWorkshopId } = modInfo;

        // deserialize xml
        const document = xmlStringToDocument(aboutFileContents, folder, meta);
        if (document === null) continue;
        const rawObject = convert<AboutXML, 'ModMetaData'>(document, meta);
        if (rawObject === null) continue;

        // format data
        const modData = formatRawData<T>(
            folder,
            rawObject.ModMetaData,
            meta,
            source,
            path,
            previewImages,
            steamWorkshopId,
        );

        mods.push(modData);
    }

    return { mods, meta };
}

export default main;

interface ModInfoResponse {
    aboutFileContents: string;
    previewImages: string[];
    steamWorkshopId: string | null;
}

function getModInfo(filePath: string, name: string, meta: LoadOperationMeta): ModInfoResponse | null {
    try {
        let fullPath = join(filePath, name);
        const subFolders = readdirSync(fullPath).filter((e) => !e.includes('.'));

        const aboutFolder = subFolders.find((name) => name.toLowerCase() === 'about');

        if (!aboutFolder) {
            meta.missingAboutFolder.push(name);
            return null;
        }

        fullPath = join(fullPath, aboutFolder);
        const subFiles = readdirSync(fullPath);

        const aboutFile = subFiles.find((name) => name.toLowerCase() === 'about.xml');
        const previewImages = subFiles
            .filter((name) => name.toLowerCase().endsWith('.png'))
            .map((image) => join(fullPath, image));
        const publishedFileId = subFiles.find((name) => name.toLowerCase() === 'publishedfileid.txt');

        let steamWorkshopId: string | null = null;
        if (publishedFileId) {
            try {
                steamWorkshopId = readFileSync(join(fullPath, publishedFileId), 'utf-8');
            } catch (error) {
                if (error instanceof Error) meta.errors.push(error);
                else meta.unknownErrors.push(error);
            }
        }

        if (!aboutFile) {
            meta.missingAboutXML.push(name);
            return null;
        }

        fullPath = join(fullPath, aboutFile);
        const aboutFileContents = readFileSync(fullPath, 'utf-8');

        return {
            aboutFileContents,
            previewImages,
            steamWorkshopId,
        };
    } catch (error) {
        if (error instanceof Error) meta.errors.push(error);
        else meta.unknownErrors.push(error);
        return null;
    }
}

export function xmlStringToDocument(s: string, folderName?: string, meta?: LoadOperationMeta): Document | null {
    try {
        // remove `<?xml version="1.0"` header if present
        const headerTagIndex = s.indexOf('?>');
        if (headerTagIndex !== -1) s = s.slice(headerTagIndex + 2);

        // s = s.replace(/[\n\r]/g, ''); // remove EOL chars
        s = s.replace(/[\s]{4}/g, '\n');

        const parser = new DOMParser();
        const document = parser.parseFromString(s, 'application/xml');

        return document;
    } catch (error) {
        if (meta && folderName) {
            meta.invalidXML.push(folderName);
            if (error instanceof Error) meta.errors.push(error);
            else meta.unknownErrors.push(error);
        }
        return null;
    }
}

type Primitive = string | number | null | Array<ParsedValue | Primitive>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ParsedValue extends Record<string, Primitive | ParsedValue> {}

/** De-serializes an XML document into a Javascript object. */
function xml2json(xml: Document | Element): ParsedValue | Primitive {
    let output: ParsedValue | Primitive = {};

    if (xml.children.length) {
        for (let i = 0, len = xml.children.length; i < len; i++) {
            const item = xml.children.item(i);
            if (!item) continue;
            const nodeName = item?.nodeName || 'Unknown';

            if (output[nodeName] === undefined) {
                const res = xml2json(item);
                output[nodeName] = res;
            } else {
                const destination = output[nodeName];
                // multiple items with same name = a list of some sort
                if (Array.isArray(destination)) {
                    destination.push(xml2json(item));
                } else {
                    output[nodeName] = [output[nodeName], xml2json(item)];
                }
            }
        }
    } else {
        let content: string | ParsedValue | null | number = xml.textContent;
        if (content?.length && !Number.isNaN(Number(content))) {
            content = Number(content);
        }
        output = content;
    }

    return output;
}

/** Replaces `li: Array(X)` key-value pairs with arrays, and removes other parsing artifacts. */
function removeRedundnantListNesting(obj: ParsedValue | Primitive): ParsedValue | Primitive {
    if (!!obj && typeof obj === 'object' && !Array.isArray(obj)) {
        for (const key in obj) {
            if (obj[key] === 0 || obj[key] === '') {
                // sometimes deserializing things results in empty strings or zero values
                delete obj[key];
                continue;
            }

            if (key === 'li') {
                // if (parentKey) {
                obj = obj[key];
                return obj;
                // }
            } else {
                obj[key] = removeRedundnantListNesting(obj[key]);
            }
        }
    }
    return obj;
}

/** Converts a document object into a record. */
export function convert<T, K extends string>(document: Document, meta?: LoadOperationMeta): Record<K, T> | null {
    try {
        const data = removeRedundnantListNesting(xml2json(document)) as object;
        return data as Record<K, T>;
    } catch (error) {
        if (meta) {
            if (error instanceof Error) meta.errors.push(error);
            else meta.unknownErrors.push(error);
        }
        return null;
    }
}

/** Formats raw object converted from an `about.xml` file into the {@link Mod} shape. */
function formatRawData<T extends ModSource>(
    folderName: string,
    rawData: AboutXML,
    meta: LoadOperationMeta,
    source: ModSource,
    path: string,
    previewImages: string[],
    steamWorkshopId: string | null,
): Mod<T> {
    const output: Mod<T> = {
        name: rawData.name || folderName,
        authors: makeAuthors(rawData.author),
        packageId: rawData.packageId,
        supportedVersions: u2a(rawData.supportedVersions).filter((e) => e !== undefined),
        folderName,
        folderPath: `${path}/${folderName}`,
        url: validateURL(meta, rawData.url),
        steamWorkshopURL: source === 'workshop' ? `steam://url/CommunityFilePage/${steamWorkshopId}` : null,
        steamWorkshopId: steamWorkshopId,
        description: rawData.description || 'No description.',
        modDependencies: rawData?.modDependencies ? u2a(rawData.modDependencies) : [],
        loadAfter: rawData?.loadAfter ? u2a(rawData.loadAfter) : [],
        incompatibleWith: rawData?.incompatibleWith ? u2a(rawData.incompatibleWith) : [],
        modDependenciesByVersion: validateDependenciesByVersion(rawData.modDependenciesByVersion),
        loadBefore: rawData?.loadBefore ? u2a(rawData.loadBefore) : [],
        descriptionsByVersion: validateVersionMap<string>(rawData.descriptionsByVersion),
        loadAfterByVersion: rawData?.loadAfterByVersion
            ? validateVersionMap<ModDependency[]>(flattenVersionMap<ModDependency>(rawData.loadAfterByVersion))
            : [],
        forceLoadBefore: rawData?.forceLoadBefore ? u2a(rawData.forceLoadBefore) : [],
        forceLoadAfter: rawData?.forceLoadAfter ? u2a(rawData.forceLoadAfter) : [],
        source,
        originalSource: source,
        previewImages,
        hidden: false,
    };

    if (source === 'core') (output as CoreMod).steamAppId = rawData?.steamAppId || null;
    if (source === 'workshop' && output?.url?.includes('steamcommunity')) {
        // some mods will have duplicate URLs
        output.url = null;
    }

    return output;
}

function makeAuthors(authorString: string): string[] {
    const allAuthors = authorString
        .split(/,|\sand\s/g) // when multiple authors, split them by commas or "and"
        .map((e) => e.replace(/\s/g, '')); // remove whitespace between first and last name

    // filter duplicate authors
    return Array.from(new Set<string>(allAuthors));
}

function validateURL(meta: LoadOperationMeta, url?: string): string | null {
    try {
        if (!url) return null;
        return new URL(url).toString();
    } catch (error) {
        if (url) {
            // some urls are just missing the https at the start
            try {
                return new URL(`https://${url}`).toString();
            } catch (error) {
                if (error instanceof Error) meta.errors.push(error);
                else meta.unknownErrors.push(error);
            }
        }
        if (error instanceof Error) meta.errors.push(error);
        else meta.unknownErrors.push(error);
        return null;
    }
}

function flattenVersionMap<T>(a: RawByVersionMap<T | T[]> | undefined): RawByVersionMap<T[]> {
    const output: RawByVersionMap<T[]> = {};
    if (!a) return output;

    for (const key in a) {
        const val = a[key];
        if (!val) continue;
        if (Array.isArray(val)) {
            output[key] = val;
        } else output[key] = [val];
    }

    return output;
}

function validateVersionMap<T>(a: RawByVersionMap<T | undefined> | undefined): NumericalByVersionMap<T> {
    const output: NumericalByVersionMap<T> = {};
    if (!a) return output;

    const keys = Object.keys(a) as (keyof typeof a)[];

    for (const key of keys) {
        const val = a[key];
        if (!val) continue;
        output[stringVersionToNumerical(key)] = val;
    }

    return output;
}

const stringVersionToNumerical = (s: string): number => Number(s.slice(1));

/** For dependency by version validation, this is needed since dependencies might be 1-length arrays,
 * which {@link validateVersionMap} doesn't account for.
 */
function validateDependenciesByVersion<T extends ModSource>(
    a: AboutXML['modDependenciesByVersion'],
): Mod<T>['modDependenciesByVersion'] {
    const output: Mod<T>['modDependenciesByVersion'] = {};
    if (!a) return output;

    const keys = Object.keys(a) as (keyof typeof a)[];

    for (const key of keys) {
        const val = a[key];
        if (!val) continue;

        const numericalKey = stringVersionToNumerical(key);

        if (Array.isArray(val)) {
            output[numericalKey] = val;
        } else output[numericalKey] = [val];
    }

    return output;
}
