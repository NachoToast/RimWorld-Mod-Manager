import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Config from '../../../types/Config';
import { RimWorldVersion } from '../../../preload/fileLoading/listLoader';
import { FilePath, Mod, ModSource, PackageId } from '../../../types/ModFiles';
import StoreState from '../state';
import {
    addToLibrary,
    addToModList,
    clearModList,
    getModLibrary,
    removeFromLibraryBySource,
    setHidden,
} from './modManager.slice';
import defaultConfig, { loadedInConfig, saveConfig } from '../../helpers/configManager';
import { addList, setCurrentList } from './listManager.slice';

export type ErrorString = string;
export type GroupingOptions = 'source' | 'none' | 'author' | 'alphabetical';

export interface State extends Config {
    settingsOpen: boolean;
    currentMod: Mod<ModSource> | null;
}

export const initialState: State = {
    ...loadedInConfig,
    settingsOpen: false,
    currentMod: null,
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

            saveConfig('filePaths', state.filePaths);
        },
        setCurrentMod(state, { payload }: { payload: Mod<ModSource> | null }) {
            if (state.currentMod?.packageId === payload?.packageId) state.currentMod = null;
            else state.currentMod = payload;
        },
        setRimWorldVersion(state, { payload }: { payload: RimWorldVersion }) {
            state.rimWorldVersion.native = payload;

            saveConfig('rimWorldVersion', state.rimWorldVersion);
        },
        setRimWorldVersionOverride(state, { payload }: { payload: number | null }) {
            state.rimWorldVersion.overriden = payload;

            saveConfig('rimWorldVersion', state.rimWorldVersion);
        },
        setModOverrides(state, { payload }: { payload: { [index: PackageId]: ModSource } }) {
            state.modSourceOverrides = payload;

            saveConfig('modSourceOverrides', state.modSourceOverrides);
        },
        setModGrouping(state, { payload }: { payload: State['modGrouping'] }) {
            state.modGrouping = payload;

            saveConfig('modGrouping', state.modGrouping);
        },
        setConfigOption(state, { payload }: { payload: { key: keyof State['config']; value: unknown } }) {
            const { key, value } = payload;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            state.config[key] = value;

            saveConfig('config', state.config);
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
    setConfigOption,
} = mainSlice.actions;

export const getSettingsOpen = (state: StoreState) => state.main.settingsOpen;
export const getFilePaths = (state: StoreState) => state.main.filePaths;
export const getCurrentMod = (state: StoreState) => state.main.currentMod;
export const getRimWorldVersion = (state: StoreState) => state.main.rimWorldVersion;
export const getRimWorldVersionOverride = (state: StoreState) => state.main.rimWorldVersion.overriden;
export const getModOverrides = (state: StoreState) => state.main.modSourceOverrides;
export const getModGrouping = (state: StoreState) => state.main.modGrouping;
export const getConfig = (state: StoreState) => state.main.config;

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
        dispatch(
            addToModList({ packageIds: activeMods, version: version?.major || defaultConfig.rimWorldVersion.fallback }),
        );

        dispatch(
            addList({
                mods: activeMods,
                createdAt: Date.now(),
                lastModified: Date.now(),
                name: 'Default List',
                description: 'Mods loaded in from ModsConfig.xml',
                version: version?.major || defaultConfig.rimWorldVersion.fallback,
            }),
        );
        dispatch(setCurrentList('Default List'));
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
    oldModOverrides: State['modSourceOverrides'];
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
                reloadModList = true;
                if (filePath !== 'modlist') modSourcesToReload.push(filePath as ModSource);
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

export const searchMods = createAsyncThunk('main/searchMods', (searchTerm: string | false, { getState, dispatch }) => {
    if (!searchTerm) {
        dispatch(setHidden([]));
        return;
    }

    const state = getState() as StoreState;

    const modLibrary = getModLibrary(state);

    const hiddenMods = new Set(Object.keys(modLibrary));

    searchTerm = searchTerm.toLowerCase();

    /** KeyMode is when searching for mod objects that have specific keys. */
    const keyMode = searchTerm.startsWith('--');
    if (keyMode) searchTerm = searchTerm.slice(2);

    for (const packageId in modLibrary) {
        const mod = modLibrary[packageId];
        let match = false;

        if (keyMode) {
            // FIXME: why tf do i have to assert `searchTerm` as a string here?
            const knownKey = Object.keys(mod).find((key) => key.toLowerCase().includes(searchTerm as string));
            if (!knownKey) continue;

            const value = mod[knownKey as keyof Mod<ModSource>];
            if (!value) continue;
            if (Array.isArray(value)) {
                match = !!value.length;
            } else {
                if (typeof value === 'object') {
                    match = !!Object.keys(value).length;
                } else match = true;
            }
        } else {
            const desc = mod.description.toLowerCase();
            const authors = mod.authors.join(', ');
            const name = mod.name.toLowerCase();

            if (name.includes(searchTerm)) match = true;
            else if (desc.includes(searchTerm)) match = true;
            else if (authors.includes(searchTerm)) match = true;
            else if (packageId.includes(searchTerm)) match = true;
        }

        if (match) {
            hiddenMods.delete(packageId);
        }
    }

    dispatch(setHidden(Array.from(hiddenMods)));
});

export default mainSlice.reducer;
