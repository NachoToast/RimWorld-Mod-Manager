import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RimWorldVersion } from '../../../preload/fileLoading/listLoader';
import { FilePath, Mod, ModSource, PackageId } from '../../../types/ModFiles';
import {
    pathDefaults,
    filePathStorageKeys,
    defaultModSourceOverrides,
    otherStorageKeys,
} from '../../constants/constants';
import StoreState from '../state';
import {
    addToLibrary,
    addToModList,
    clearModList,
    getModLibrary,
    removeFromLibraryBySource,
    setHidden,
} from './modManager.slice';

export type ErrorString = string;
export type GroupingOptions = 'source' | 'none' | 'author' | 'alphabetical';

export interface State {
    settingsOpen: boolean;

    filePaths: {
        [K in FilePath]: string;
    };

    currentMod: Mod<ModSource> | null;

    rimWorldVersion: RimWorldVersion | null;
    rimwWorldVersionOverride: number | null;

    modOverrides: {
        [index: PackageId]: ModSource;
    };

    // filter

    // group
    modGrouping: GroupingOptions;
}

const getFromStorage = (t: FilePath): string => localStorage.getItem(filePathStorageKeys[t]) || pathDefaults[t];
const getAllFromStorage = (): { [K in FilePath]: string } => {
    return {
        core: getFromStorage('core'),
        local: getFromStorage('local'),
        modlist: getFromStorage('modlist'),
        workshop: getFromStorage('workshop'),
    };
};

export const initialState: State = {
    settingsOpen: false,

    filePaths: getAllFromStorage(),

    currentMod: null,

    rimWorldVersion: null,
    rimwWorldVersionOverride: null,

    modOverrides: (() => {
        const item = localStorage.getItem(otherStorageKeys.modSourceOverrides);
        if (item) return JSON.parse(item);
        else return defaultModSourceOverrides;
    })(),

    modGrouping: 'source',
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setSettingsOpen(state, { payload }: { payload: boolean }) {
            state.settingsOpen = payload;
        },
        setFilePath(state, action: { payload: { newPath: string; target: FilePath } }) {
            const { newPath, target } = action.payload;
            state.filePaths[target] = newPath || state.filePaths[target];

            // only set local storage if different from default
            if (newPath !== pathDefaults[target]) {
                localStorage.setItem(filePathStorageKeys[target], newPath);
            } else {
                localStorage.removeItem(filePathStorageKeys[target]);
            }
        },
        setCurrentMod(state, { payload }: { payload: Mod<ModSource> | null }) {
            if (state.currentMod?.packageId === payload?.packageId) state.currentMod = null;
            else state.currentMod = payload;
        },
        setRimWorldVersion(state, { payload }: { payload: RimWorldVersion }) {
            state.rimWorldVersion = payload;
        },
        setRimWorldVersionOverride(state, { payload }: { payload: number | null }) {
            state.rimwWorldVersionOverride = payload;
        },
        setModOverrides(state, { payload }: { payload: { [index: PackageId]: ModSource } }) {
            state.modOverrides = payload;

            // only set local storage if different from default
            let isDefault = true;
            if (Object.keys(payload).length !== Object.keys(defaultModSourceOverrides).length) {
                isDefault = false;
            } else {
                for (const packageId in defaultModSourceOverrides) {
                    if (payload[packageId] !== defaultModSourceOverrides[packageId]) {
                        isDefault = false;
                        break;
                    }
                }
            }

            if (isDefault) localStorage.removeItem(otherStorageKeys.modSourceOverrides);
            else localStorage.setItem(otherStorageKeys.modSourceOverrides, JSON.stringify(state.modOverrides));
        },
        setModGrouping(state, { payload }: { payload: State['modGrouping'] }) {
            state.modGrouping = payload;
        },
    },
});

export const {
    setSettingsOpen,
    setFilePath,
    setCurrentMod,
    setRimWorldVersion,
    setRimWorldVersionOverride,
    setModOverrides,
    setModGrouping,
} = mainSlice.actions;

export const getSettingsOpen = (state: StoreState) => state.main.settingsOpen;
export const getFilePaths = (state: StoreState) => state.main.filePaths;
export const getCurrentMod = (state: StoreState) => state.main.currentMod;
export const getRimWorldVersion = (state: StoreState) => state.main.rimWorldVersion;
export const getRimWorldVersionOverride = (state: StoreState) => state.main.rimwWorldVersionOverride;
export const getModOverrides = (state: StoreState) => state.main.modOverrides;
export const getModGrouping = (state: StoreState) => state.main.modGrouping;

export const loadMods = createAsyncThunk('main/loadMods', (source: ModSource, { getState, dispatch }) => {
    const state = getState() as StoreState;
    const path = getFilePaths(state)[source];
    const modOverrides = getModOverrides(state);

    dispatch(removeFromLibraryBySource(source));
    try {
        const { mods } = window.api.modLoader(path, source);
        for (const mod of mods) {
            const source = modOverrides[mod.packageId.toLowerCase()] || mod.source;
            dispatch(addToLibrary({ ...mod, source }));
        }
    } catch (error) {
        console.log(error);
    }
});

export const loadModList = createAsyncThunk('main/loadModList', (_, { getState, dispatch }) => {
    const state = getState() as StoreState;
    const path = getFilePaths(state)['modlist'];
    dispatch(clearModList());
    try {
        const { activeMods, version } = window.api.listLoader(path);
        dispatch(setRimWorldVersion(version));
        for (const packageId of activeMods) {
            dispatch(addToModList({ packageId }));
        }
    } catch (error) {
        console.log(error);
    }
});

export const initialLoad = createAsyncThunk('main/initialLoad', (_, { getState, dispatch }) => {
    const state = getState() as StoreState;
    const paths = getFilePaths(state);
    for (const path in paths) {
        if (path === 'modlist') continue;
        dispatch(loadMods(path as ModSource));
    }
    dispatch(loadModList());
});

interface HandleSettingsCloseArgs {
    oldFilePaths: State['filePaths'];
    oldModOverrides: State['modOverrides'];
}

/** Checking changes in settings once it closes, so we know when to run
 * any expensive tasks.
 */
export const handleSettingsClose = createAsyncThunk(
    'main/handleSettingsClose',
    (args: HandleSettingsCloseArgs, { getState, dispatch }) => {
        const { oldFilePaths, oldModOverrides } = args;
        const state = getState() as StoreState;
        const newFilePaths = getFilePaths(state);
        const newModOverrides = getModOverrides(state);
        const modLibrary = getModLibrary(state);

        let reloadModList = false;
        const modSourcesToReload: ModSource[] = [];
        const specificModsToReload: Set<Mod<ModSource>> = new Set();

        // checking if file paths changed
        for (const k in newFilePaths) {
            const filePath = k as FilePath;
            if (newFilePaths[filePath] !== oldFilePaths[filePath]) {
                if (filePath === 'modlist') reloadModList = true;
                else modSourcesToReload.push(filePath as ModSource);
            }
        }

        // checking if mod overrides have changed
        {
            const checkedOldValues = Object.keys(oldModOverrides) as PackageId[];
            for (const packageId in newModOverrides) {
                if (oldModOverrides[packageId]) {
                    // if value is present in both old and new

                    checkedOldValues.splice(checkedOldValues.indexOf(packageId), 1);
                    const oldSource: ModSource = oldModOverrides[packageId];
                    const newSource: ModSource = newModOverrides[packageId];
                    if (newSource !== oldSource) {
                        // if the value has changed, and a mod for that package id exists
                        const mod = modLibrary[packageId.toLowerCase()];
                        if (mod) specificModsToReload.add(mod);
                    }
                } else {
                    // value must only be present in new
                    const mod = modLibrary[packageId.toLowerCase()];
                    console.log(`new ${packageId} (mod: ${!!mod})`);
                    if (mod) specificModsToReload.add(mod);
                }
            }
            // now check old values that are not in new (aka were not spliced)
            checkedOldValues.forEach((packageId) => {
                const mod = modLibrary[packageId.toLowerCase()];
                if (mod) specificModsToReload.add(mod);
            });
        }

        /// reloding

        if (modSourcesToReload.length) {
            for (const source of modSourcesToReload) {
                dispatch(loadMods(source));
                specificModsToReload.forEach((mod) => {
                    // we've just reloaded ALL mods from this source,
                    // so we no longer need to reload specific mods
                    // of the same source
                    if (mod.source === source) specificModsToReload.delete(mod);
                });
            }
        }

        if (specificModsToReload.size) {
            specificModsToReload.forEach((mod) => {
                if (newModOverrides[mod.packageId.toLowerCase()]) {
                    dispatch(addToLibrary({ ...mod, source: newModOverrides[mod.packageId.toLowerCase()] }));
                } else {
                    dispatch(addToLibrary({ ...mod, source: mod.originalSource }));
                }
            });
        }

        if (reloadModList) {
            dispatch(loadModList());
        }
    },
);

export const searchMods = createAsyncThunk('main/searchMods', (searchTerm: string, { getState, dispatch }) => {
    const state = getState() as StoreState;

    const modLibrary = getModLibrary(state);

    const hiddenMods = new Set(Object.keys(modLibrary));

    const searchTerms = searchTerm.toLowerCase().split(/\s/g);
    for (const packageId in modLibrary) {
        const mod = modLibrary[packageId];
        const desc = mod.description.toLowerCase();
        const authors = mod.authors.join(', ');

        let match = false;
        if (searchTerms.some((term) => desc.includes(term))) match = true;
        else if (searchTerms.some((term) => authors.includes(term))) match = true;
        else if (searchTerms.some((term) => packageId.includes(term))) match = true;

        if (match) {
            hiddenMods.delete(packageId);
        }
    }

    dispatch(setHidden(Array.from(hiddenMods)));
});

export default mainSlice.reducer;
