import { PackageId } from './ModFiles';

export default interface SaveList {
    mods: PackageId[];
    /** Unix timestamp */
    createdAt: number;
    /** Unix timestamp */
    lastModified: number;

    name: string;
    description: string;

    version: number;
}
