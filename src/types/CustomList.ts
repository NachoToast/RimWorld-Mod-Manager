import { PackageId } from './ModFiles';

export enum SortTypes {
    Alphabetical = 'alphabetical',
    Dependencies = 'dependencies',
    CoreLibrariesFirst = 'core mods first',
    Random = 'random',
    Manual = 'manual',
    Unknown = 'unknown',
}

export default interface CustomList {
    id: string;
    mods: PackageId[];
    createdAt: number;
    lastModified: number;

    name: string;
    description: string;

    rimWorldVersion: number;

    sorting: SortTypes[];
}
