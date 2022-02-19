/* File structures for common mod metadata files, such as About.xml and Manifest.xml. */
// percentages show likelihood of stat being included in workshop, and likelihood of value type (n=230)

export type PackageId = string;

export type ModSource = 'workshop' | 'local' | 'core';
export type FilePath = ModSource | 'modlist';

export interface ModDependency {
    packageId: PackageId;
    displayName: string;
    steamWorkshopUrl?: string;
    downloadUrl?: string;
}

/** @example
 * ```ts
 * {
 *   'v1.0': T,
 *   'v1.1': T,
 *   'v1.2': T,
 *   etc...
 * }
 * ```
 */
export type RawByVersionMap<T> = Record<string, T>;

export type NumericalByVersionMap<T> = Record<number, T>;

export interface ModList<T extends ModSource> {
    [index: PackageId]: Mod<T>;
}

export interface AboutXML {
    name: string;
    author: string;
    packageId: PackageId;

    /** 79% number[], 20% number */
    supportedVersions: number[] | number;

    /** May contain links, and special formatting, and html escape characters.
     *
     * @example
     * ```txt
     * <color=#FFD800><size=24>What ?</size></color>
     * <color=#27ae60><size=18><b>></b></size></color>
     *
     *
     * 98%
     */
    description?: string;

    /** 59% overall; 80% object, 19% object[] */
    modDependencies?: ModDependency | ModDependency[];

    /** 48% overall; 51% string[], 48% string */
    loadAfter?: PackageId[] | PackageId;

    /** May be "none" or "link" so needs URL() verification.
     * May also be missing the https.
     *
     * 35%
     */
    url?: string;

    /** 6% overall; 53% string, 46% string[] */
    incompatibleWith?: PackageId | PackageId[];

    /** 4% */
    modDependenciesByVersion?: RawByVersionMap<ModDependency | [ModDependency]>;

    /** 4% overall; 72% string, 27% string[] */
    loadBefore?: PackageId | PackageId[];

    /** 2% overall */
    descriptionsByVersion?: RawByVersionMap<AboutXML['description']>;

    /** 2% overall; 100% object */
    loadAfterByVersion?: RawByVersionMap<ModDependency>;

    /** Only seen on core "mods" */
    forceLoadBefore?: PackageId | PackageId[];
    forceLoadAfter?: PackageId | PackageId[];
    steamAppId?: number;
}

export interface Mod<T extends ModSource> {
    name: string;
    authors: string[];
    packageId: PackageId;
    previewImages: string[];
    supportedVersions: number[];
    folderName: string;
    folderPath: string;
    url: string | null;
    steamWorkshopURL: string | null;
    steamWorkshopId: string | null;
    description: string;
    modDependencies: ModDependency[];
    loadAfter: PackageId[];
    incompatibleWith: PackageId[];
    modDependenciesByVersion: NumericalByVersionMap<ModDependency>;
    loadBefore: PackageId[];
    descriptionsByVersion: NumericalByVersionMap<Mod<T>['description']>;
    loadAfterByVersion: NumericalByVersionMap<ModDependency>;

    forceLoadBefore: PackageId[];
    forceLoadAfter: PackageId[];

    source: ModSource;
    originalSource: ModSource;
    hidden: boolean;
}

export interface WorkshopMod extends Mod<'workshop'> {
    steamWorkshopURL: string;
    steamWorkshopId: string;
    source: 'workshop';
}

export interface LocalMod extends Mod<'local'> {
    steamWorkshopURL: null;
    steamWorkshopId: null;
    source: 'local';
}

export interface CoreMod extends Mod<'core'> {
    steamWorkshopURL: null;
    steamWorkshopId: null;

    /** Expansions have a Steam app ID, base RimWorld does not. */
    steamAppId: number | null;
    source: 'core';
}
