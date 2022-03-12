import { createSlice } from '@reduxjs/toolkit';
import { FilePath, Mod, ModSource } from '../../../../types/ModFiles';
import { loadFromStorage, saveToStorage } from '../../storageHelpers';
import { StoreState } from '../../store';

export type NeedsLoading = FilePath;

export enum Pages {
    Browse,
    Sort,
    Lists,
    Settings,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface State {
    page: Pages;
    focussedMod?: Mod<ModSource>;
}

export const initialState: State = {
    page: loadFromStorage('main', 'page') || Pages.Browse,
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setPage(state, action: { payload: Pages }) {
            state.page = action.payload;

            saveToStorage('main', 'page', action.payload);
        },
        setFocussedMod(state, action: { payload: Mod<ModSource> | undefined }) {
            state.focussedMod = action.payload;
        },
    },
});

export const { setPage, setFocussedMod } = mainSlice.actions;

export const getPage = (state: StoreState) => state.main.page;
export const getFocussedMod = (state: StoreState) => state.main.focussedMod;

export default mainSlice.reducer;
