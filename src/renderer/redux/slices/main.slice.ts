import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FilePaths, Mod, ModPaths, PackageId } from '../../../types/ModFiles';
import { pathDefaults, storageKeys } from '../../constants/constants';
import StoreState from '../state';

export interface State {
    settingsOpen: boolean;

    loading: string[];

    filePaths: {
        [K in FilePaths]: string;
    };
    previousFilePaths: {
        [K in FilePaths]: string;
    };

    mods: {
        [K in ModPaths]: Mod[] | string | undefined;
    };

    activeModList: PackageId[] | undefined;
}

const getFromStorage = (t: FilePaths): string => localStorage.getItem(storageKeys[t]) || pathDefaults[t];

export const initialState: State = {
    settingsOpen: false,

    loading: [],

    filePaths: {
        workshop: getFromStorage('workshop'),
        local: getFromStorage('local'),
        modlist: getFromStorage('modlist'),
    },
    previousFilePaths: {
        workshop: getFromStorage('workshop'),
        local: getFromStorage('local'),
        modlist: getFromStorage('modlist'),
    },

    mods: {
        local: undefined,
        workshop: undefined,
    },
    activeModList: undefined,
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
                    const k = key as FilePaths;
                    if (state.previousFilePaths[k] !== state.filePaths[k]) {
                        if (k === 'modlist') state.activeModList = undefined;
                        else state.mods[k] = undefined;
                    }
                }
            }
        },
        toggleLoading(state, { payload }: { payload: string }) {
            const index = state.loading.indexOf(payload);
            if (index === -1) state.loading.push(payload);
            else state.loading.splice(index, 1);
        },
        setFilePath(state, action: { payload: { newPath: string; target: FilePaths } }) {
            const { newPath, target } = action.payload;
            state.filePaths[target] = newPath || state.filePaths[target];
            localStorage.setItem(storageKeys[target], newPath);
        },
        setMods(state, action: { payload: { mods: Mod[] | string; target: ModPaths } }) {
            const { mods, target } = action.payload;
            state.mods[target] = mods;
        },
        setActiveModList(state, { payload }: { payload: PackageId[] }) {
            state.activeModList = payload;
        },
    },
});

export const { setSettingsOpen, toggleLoading, setFilePath, setMods, setActiveModList } = mainSlice.actions;

export default mainSlice.reducer;

export const getSettingsOpen = (state: StoreState): boolean => state.main.settingsOpen;

export const getLoading = (state: StoreState): State['loading'] => state.main.loading;

export const getFilePaths = (state: StoreState): State['filePaths'] => state.main.filePaths;

export const getMods = (state: StoreState): State['mods'] => state.main.mods;

// eslint-disable-next-line require-await
export const loadMods = createAsyncThunk('main/loadMods', async (target: ModPaths, { getState, dispatch }) => {
    // dispatch(toggleLoading())
    const state = getState() as StoreState;
    const path = getFilePaths(state)[target];

    try {
        const res = window.api.modLoader(path, target);
        dispatch(setMods({ target, mods: res.mods }));
    } catch (error) {
        let mods = 'Unknown error occcurred';
        if (error instanceof Error) mods = error.message;
        dispatch(setMods({ target, mods }));
    }
});
