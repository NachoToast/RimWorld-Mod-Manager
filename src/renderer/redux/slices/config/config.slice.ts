import { createSlice } from '@reduxjs/toolkit';
import { FilePath } from '../../../../types/ModFiles';
import { loadFromStorage, saveToStorage } from '../../storageHelpers';
import { StoreState } from '../../store';

export type GroupingOptions = 'source' | 'none' | 'author' | 'alphabetical';

export interface State {
    filePaths: Record<FilePath, string>;
}

export const initialState: State = {
    filePaths: loadFromStorage('config', 'filePaths') || {
        workshop: 'C:\\Program Files (x86)\\Steam\\steamapps\\workshop\\content\\294100',
        local: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RimWorld\\Mods',
        modlist:
            'C:\\Users\\USERNAME\\AppData\\LocalLow\\Ludeon Studios\\RimWorld by Ludeon Studios\\Config\\ModsConfig.xml',
        core: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RimWorld\\Data',
    },
};

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setFilePaths(state, { payload }: { payload: Record<FilePath, string> }) {
            state.filePaths = payload;

            saveToStorage('config', 'filePaths', state.filePaths);
        },
    },
});

export const { setFilePaths } = configSlice.actions;

export const getFilePaths = (state: StoreState) => state.config.filePaths;

export default configSlice.reducer;
