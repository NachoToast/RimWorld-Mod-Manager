import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FilePath, Mod, ModList, ModSource } from '../../../types/ModFiles';
import { pathDefaults, storageKeys } from '../../constants/constants';
import StoreState from '../state';

export type ErrorString = string;

export interface State {
    settingsOpen: boolean;

    filePaths: {
        [K in FilePath]: string;
    };

    /** Used for checking changes on settings close. */
    previousFilePaths: {
        [K in FilePath]: string;
    };

    mods: {
        [K in ModSource]: ModList<K> | ErrorString | undefined;
    };

    currentModList: ModList<ModSource> | ErrorString | undefined;

    currentMod: Mod<ModSource> | null;
}

const getFromStorage = (t: FilePath): string => localStorage.getItem(storageKeys[t]) || pathDefaults[t];

export const initialState: State = {
    settingsOpen: false,

    filePaths: {
        workshop: getFromStorage('workshop'),
        local: getFromStorage('local'),
        modlist: getFromStorage('modlist'),
        core: getFromStorage('core'),
    },
    previousFilePaths: {
        workshop: getFromStorage('workshop'),
        local: getFromStorage('local'),
        modlist: getFromStorage('modlist'),
        core: getFromStorage('core'),
    },

    mods: {
        local: undefined,
        workshop: undefined,
        core: undefined,
    },

    currentModList: undefined,

    currentMod: null,
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setSettingsOpen(state, { payload }: { payload: boolean }) {
            state.settingsOpen = payload;
            if (payload) state.previousFilePaths = state.filePaths;
            else {
                // check for changes in file paths when settings is closed
                for (const key of Object.keys(state.previousFilePaths)) {
                    const k = key as FilePath;
                    if (state.previousFilePaths[k] !== state.filePaths[k]) {
                        if (k === 'modlist') state.currentModList = undefined;
                        else state.mods[k] = undefined;
                    }
                }
            }
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
        setMods(state, action: { payload: { mods: ModList<ModSource> | ErrorString; target: ModSource } }) {
            const { mods, target } = action.payload;
            state.mods[target] = mods;
        },
        setCurrentModList(state, { payload }: { payload: ModList<ModSource> }) {
            state.currentModList = payload;
        },
        setCurrentMod(state, { payload }: { payload: Mod<ModSource> | null }) {
            state.currentMod = payload;
        },
    },
});

export const { setSettingsOpen, setFilePath, setMods, setCurrentModList, setCurrentMod } = mainSlice.actions;

export default mainSlice.reducer;

export const getSettingsOpen = (state: StoreState) => state.main.settingsOpen;

export const getFilePaths = (state: StoreState) => state.main.filePaths;

export const getMods = (state: StoreState) => state.main.mods;

export const getCurrentMod = (state: StoreState) => state.main.currentMod;

export const loadMods = createAsyncThunk('main/loadMods', (target: ModSource, { getState, dispatch }) => {
    const state = getState() as StoreState;
    const path = getFilePaths(state)[target];
    try {
        const { mods, meta } = window.api.modLoader(path, target);
        dispatch(setMods({ target, mods }));
        console.log(meta);
    } catch (error) {
        let mods = 'Unknown error occcurred';
        if (error instanceof Error) mods = error.message;
        dispatch(setMods({ target, mods }));
    }
});
