import { configureStore } from '@reduxjs/toolkit';
import mainSlice, { State as MainState } from './slices/main';
import configSlice, { State as ConfigState } from './slices/config';
import modLibrarySlice, { State as ModLibraryState } from './slices/modLibrary';
import listManagerSlice, { State as ListManagerState } from './slices/listManager/';

export interface StoreState {
    main: MainState;
    config: ConfigState;
    modLibrary: ModLibraryState;
    listManager: ListManagerState;
}

const store = configureStore({
    reducer: {
        main: mainSlice,
        config: configSlice,
        modLibrary: modLibrarySlice,
        listManager: listManagerSlice,
    },
});

export default store;
