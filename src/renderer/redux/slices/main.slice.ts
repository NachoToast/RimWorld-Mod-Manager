import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RimWorldVersion } from '../../../preload/fileLoading/listLoader';
import { FilePath, Mod, ModSource } from '../../../types/ModFiles';
import { pathDefaults, storageKeys } from '../../constants/constants';
import StoreState from '../state';
import { addToLibrary, addToModList, clearModList, removeFromLibraryBySource } from './modManager.slice';

export type ErrorString = string;

export interface State {
    settingsOpen: boolean;

    filePaths: {
        [K in FilePath]: string;
    };

    currentMod: Mod<ModSource> | null;

    rimWorldVersion: RimWorldVersion | null;
    rimwWorldVersionOverride: number | null;
}

const getFromStorage = (t: FilePath): string => localStorage.getItem(storageKeys[t]) || pathDefaults[t];
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
                localStorage.setItem(storageKeys[target], newPath);
            } else {
                localStorage.removeItem(storageKeys[target]);
            }
        },
        setCurrentMod(state, { payload }: { payload: Mod<ModSource> | null }) {
            state.currentMod = payload;
        },
        setRimWorldVersion(state, { payload }: { payload: RimWorldVersion }) {
            state.rimWorldVersion = payload;
        },
        setRimWorldVersionOverride(state, { payload }: { payload: number | null }) {
            state.rimwWorldVersionOverride = payload;
        },
    },
});

export const { setSettingsOpen, setFilePath, setCurrentMod, setRimWorldVersion, setRimWorldVersionOverride } =
    mainSlice.actions;

export const getSettingsOpen = (state: StoreState) => state.main.settingsOpen;
export const getFilePaths = (state: StoreState) => state.main.filePaths;
export const getCurrentMod = (state: StoreState) => state.main.currentMod;
export const getRimWorldVersion = (state: StoreState) => state.main.rimWorldVersion;
export const getRimWorldVersionOverride = (state: StoreState) => state.main.rimwWorldVersionOverride;

export const loadMods = createAsyncThunk('main/loadMods', (target: ModSource, { getState, dispatch }) => {
    const state = getState() as StoreState;
    const path = getFilePaths(state)[target];
    dispatch(removeFromLibraryBySource(target));
    try {
        const { mods } = window.api.modLoader(path, target);
        for (const mod of mods) {
            dispatch(addToLibrary(mod));
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
    console.log('initial load');
    const state = getState() as StoreState;
    const paths = getFilePaths(state);
    for (const path in paths) {
        if (path === 'modlist') continue;
        dispatch(loadMods(path as ModSource));
    }
    dispatch(loadModList());
});

export const checkFilePathsChanged = createAsyncThunk(
    'main/checkFilePathsChanged',
    (oldValues: State['filePaths'], { getState, dispatch }) => {
        const state = getState() as StoreState;
        const newValues = getFilePaths(state);

        // modlist should be reloaded when files change
        let reloadModList = false;

        for (const valueName in newValues) {
            const k = valueName as FilePath;
            if (newValues[k] !== oldValues[k]) {
                reloadModList = true;
                if (k !== 'modlist') dispatch(loadMods(k as ModSource));
            }
        }

        if (reloadModList) dispatch(loadModList());
    },
);

export default mainSlice.reducer;
