import { createSlice } from '@reduxjs/toolkit';
import StoreState from '../state';

export enum ConfigOptions {
    /** Whether the "View Raw" button is visible. */
    ViewRawPreviewButton = 'viewRawPreviewButton',
    /** Whether to view raw by default in the mod preview. */
    RawJsonPreviewDefault = 'rawJsonPreviewDefault',
    /** Whether steam links should be opened in the steam app, or the browser. */
    OpenWorkshopLinksInBrowser = 'openWorkshopLinksInBrowser',
}

export interface State {
    /** Boolean options that are off by default. */
    booleanDefaultOff: {
        [ConfigOptions.ViewRawPreviewButton]: boolean;
        [ConfigOptions.RawJsonPreviewDefault]: boolean;
        [ConfigOptions.OpenWorkshopLinksInBrowser]: boolean;
    };
}

export const initialState: State = {
    booleanDefaultOff: {
        [ConfigOptions.ViewRawPreviewButton]: !!localStorage.getItem(ConfigOptions.ViewRawPreviewButton) || false,
        [ConfigOptions.RawJsonPreviewDefault]: !!localStorage.getItem(ConfigOptions.RawJsonPreviewDefault) || false,
        [ConfigOptions.OpenWorkshopLinksInBrowser]:
            !!localStorage.getItem(ConfigOptions.OpenWorkshopLinksInBrowser) || false,
    },
};

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setBooleanOption(state, { payload }: { payload: { key: ConfigOptions; value: boolean } }) {
            const { key, value } = payload;
            state.booleanDefaultOff[key] = value;
            // value doesn't matter, as long as its truthy
            if (value) localStorage.setItem(key, 'yeet');
            else localStorage.removeItem(key);
        },
    },
});

export const { setBooleanOption } = configSlice.actions;

export const getConfig = (state: StoreState) => state.config;

export default configSlice.reducer;
