import mainSlice, { State as MainState } from './slices/main';
import modManagerSlice, { State as ModManagerState } from './slices/modManager';
import listManagerSlice, { State as ListManagerState } from './slices/listManager';
import { configureStore } from '@reduxjs/toolkit';

export interface StoreState {
    main: MainState;
    modManager: ModManagerState;
    listManager: ListManagerState;
}

export const store = configureStore({
    reducer: {
        main: mainSlice,
        modManager: modManagerSlice,
        listManager: listManagerSlice,
    },
});
