import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FilePath, Mod, ModSource } from '../../../types/ModFiles';
import { pathDefaults, storageKeys } from '../../constants/constants';
import StoreState from '../state';
import { addToLibrary, addToModList } from './modManager.slice';

export type ErrorString = string;

export interface State {
    settingsOpen: boolean;

    filePaths: {
        [K in FilePath]: string;
    };

    currentMod: Mod<ModSource> | null;
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
    },
});

export const { setSettingsOpen, setFilePath, setCurrentMod } = mainSlice.actions;

export const getSettingsOpen = (state: StoreState) => state.main.settingsOpen;
export const getFilePaths = (state: StoreState) => state.main.filePaths;
export const getCurrentMod = (state: StoreState) => state.main.currentMod;

export const loadMods = createAsyncThunk('main/loadMods', (target: ModSource, { getState, dispatch }) => {
    const state = getState() as StoreState;
    const path = getFilePaths(state)[target];
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
    try {
        const { activeMods, version } = window.api.listLoader(path);
        console.log(`Detected RimWorld ${version.major} ${version.minor} ${version.rev}`);
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

export default mainSlice.reducer;
