import { createSlice } from '@reduxjs/toolkit';
import StoreState from '../state';

export enum ConfigOptionNameProps {
    ViewRawPreviewButton = 'viewRawPreviewButton',
    RawJsonPreviewDefault = 'rawJsonPreviewDefault',
}

export interface State {
    [ConfigOptionNameProps.ViewRawPreviewButton]: boolean;
    [ConfigOptionNameProps.RawJsonPreviewDefault]: boolean;
}

export const initialState: State = {
    [ConfigOptionNameProps.ViewRawPreviewButton]:
        !!localStorage.getItem(ConfigOptionNameProps.ViewRawPreviewButton) || false,
    [ConfigOptionNameProps.RawJsonPreviewDefault]:
        !!localStorage.getItem(ConfigOptionNameProps.RawJsonPreviewDefault) || false,
};

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        /** In future if this slice gets bigger we will need to group config options into booleans, strings, etc..
         * But for now this is fine.
         */
        setOption(state, { payload }: { payload: { key: ConfigOptionNameProps; value: boolean } }) {
            const { key, value } = payload;
            state[key] = value;
            if (value) localStorage.setItem(key, 'yeet');
            // value doesn't matter, as long as its truthy
            else localStorage.removeItem(key);
        },
    },
});

export const { setOption } = configSlice.actions;

export const getConfig = (state: StoreState) => state.config;

export default configSlice.reducer;
