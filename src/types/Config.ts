import { GroupingOptions } from '../renderer/redux/slices/main.slice';
import { RimWorldVersion } from '../preload/fileLoading/listLoader';
import { FilePath, ModSource, PackageId } from './ModFiles';

export default interface Config {
    filePaths: Record<FilePath, string>;
    modSourceOverrides: Record<PackageId, ModSource>;
    rimWorldVersion: {
        fallback: number;
        /** Is null before modlist is loaded in. */
        native: RimWorldVersion | null;
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
