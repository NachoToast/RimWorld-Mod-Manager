import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PackageId, Mod, ModSource } from '../../../../types/ModFiles';
import { StoreState } from '../../store';
import { getFilePaths } from '../config';

export interface State {
    core: Record<PackageId, Mod<'core'>>;
    local: Record<PackageId, Mod<'local'>>;
    workshop: Record<PackageId, Mod<'workshop'>>;

    search: {
        active: boolean;
        results: Mod<ModSource>[];
    };
}

export const initialState: State = {
    core: {},
    local: {},
    workshop: {},

    search: {
        active: false,
        results: [],
    },
};

const modLibrarySlice = createSlice({
    name: 'modLibrary',
    initialState,
    reducers: {
        addMods(state, action: { payload: Mod<ModSource>[] }) {
            const mods = action.payload;
            mods.forEach((mod) => (state[mod.source][mod.packageId.toLowerCase()] = mod));
        },
        addMod(state, action: { payload: Mod<ModSource> }) {
            const mod = action.payload;
            state[mod.source][mod.packageId.toLowerCase()] = mod;
        },
        removeMod(state, action: { payload: Mod<ModSource> }) {
            const mod = action.payload;
            delete state[mod.source][mod.packageId.toLowerCase()];
        },
        resetMods(state, action?: { payload: ModSource }) {
            const source = action?.payload;
            if (source) {
                state[source] = {};
            } else {
                state['core'] = {};
                state['local'] = {};
                state['workshop'] = {};
            }
        },
        hideMods(state, action: { payload: Mod<ModSource>[] }) {
            state.search.active = true;
            state.search.results = action.payload;
        },
        unhideMods(state) {
            state.search.active = false;
            state.search.results = [];
        },
    },
});

export const { addMods, addMod, removeMod, resetMods, hideMods, unhideMods } = modLibrarySlice.actions;

export const getLibrarySize = (state: StoreState, source?: ModSource): number => {
    if (source) return Object.keys(state.modLibrary[source]).length;
    else {
        return (
            Object.keys(state.modLibrary.core).length +
            Object.keys(state.modLibrary.local).length +
            Object.keys(state.modLibrary.workshop).length
        );
    }
};

export const getFilteredModLibrary = (state: StoreState): Record<PackageId, Mod<ModSource>> => {
    if (state.modLibrary.search.active) {
        const output: Record<PackageId, Mod<ModSource>> = {};
        state.modLibrary.search.results.forEach((mod) => {
            output[mod.packageId.toLowerCase()] = mod;
        });
        return output;
    } else return getModLibrary(state);
};

export const getModLibrary = (state: StoreState): Record<PackageId, Mod<ModSource>> => {
    const coreMods = state.modLibrary.core;
    const localMods = state.modLibrary.local;
    const workshopMods = state.modLibrary.workshop;

    return { ...coreMods, ...localMods, ...workshopMods };
};

export const loadAllMods = createAsyncThunk('modLibrary/loadAllMods', (_, { getState, dispatch }) => {
    dispatch(loadMods('core'));
    dispatch(loadMods('local'));
    dispatch(loadMods('workshop'));

    const state = getState() as StoreState;
    const numCore = getLibrarySize(state, 'core');
    const numWorkshop = getLibrarySize(state, 'workshop');
    const numLocal = getLibrarySize(state, 'local');
    console.log(numCore, numWorkshop, numLocal);
});

export const loadMods = createAsyncThunk('modLibrary/loadMods', (source: ModSource, { getState, dispatch }) => {
    const state = getState() as StoreState;
    const filePath = getFilePaths(state)[source];

    dispatch(resetMods(source));

    try {
        const { mods } = window.api.modLoader(filePath, source);
        dispatch(addMods(mods));
    } catch (error) {
        console.log(error);
    }
});

export const searchMods = createAsyncThunk('modLibrary/searchMods', (searchTerm: string, { getState, dispatch }) => {
    searchTerm = searchTerm.toLowerCase();

    const state = getState() as StoreState;

    dispatch(unhideMods());
    const mods = getModLibrary(state);
    const searchResults: Mod<ModSource>[] = [];

    for (const mod of Object.values(mods)) {
        if (
            mod.name.toLowerCase().includes(searchTerm) ||
            mod.packageId.toLowerCase().includes(searchTerm) ||
            mod.description.toLowerCase().includes(searchTerm)
        ) {
            searchResults.push(mod);
        }
    }

    dispatch(hideMods(searchResults));
});

export default modLibrarySlice.reducer;
