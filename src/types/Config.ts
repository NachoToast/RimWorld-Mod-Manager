import { RimWorldVersion } from '../preload/fileLoading/listLoader';
import { FilePath, ModSource, PackageId } from './ModFiles';

export type GroupingOptions = 'source' | 'none' | 'author' | 'alphabetical';
export default interface Config {
    filePaths: Record<FilePath, string>;
    modSourceOverrides: Record<PackageId, ModSource>;
    rimWorldVersion: {
        fallback: number;
        /** Is null before modlist is loaded in. */
        native: RimWorldVersion | null;
        /** Is null before the modlist is loaded in. */
        knownExpansions: PackageId[] | null;
        overriden: number | null;
        overrideOptions: number[];
    };
    modGrouping: GroupingOptions;
    config: {
        viewRawButtonInPreview: boolean;
        showRawJsonByDefault: boolean;
        openSteamInBrowser: boolean;
        locale: string;
    };
}
