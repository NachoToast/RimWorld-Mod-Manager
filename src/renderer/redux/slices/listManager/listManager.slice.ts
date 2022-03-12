import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ModsConfig } from '../../../../preload/fileLoading/listLoader';
import CustomList from '../../../../types/CustomList';
import { loadFromStorage, saveToStorage } from '../../storageHelpers';
import { StoreState } from '../../store';
import { getFilePaths } from '../config';
import { v4 as uuid } from 'uuid';
import formatListAsXml from '../../../helpers/formatListAsXml';

export interface State {
    customLists: Record<string, CustomList>;

    modsConfig?: ModsConfig;

    selectedList?: string;
}

export const initialState: State = {
    customLists: loadFromStorage('listManager', 'customLists') || {},
    selectedList: loadFromStorage('listManager', 'selectedList') || undefined,
};

const listManagerSlice = createSlice({
    name: 'listManager',
    initialState,
    reducers: {
        modifyCustomList(state, action: { payload: CustomList }) {
            const list = action.payload;
            state.customLists[list.id] = list;

            saveToStorage('listManager', 'customLists', state.customLists);
        },
        deleteCustomList(state, action: { payload: string }) {
            const id = action.payload;
            delete state.customLists[id];

            saveToStorage('listManager', 'customLists', state.customLists);

            // if the list was selected, change it to next available list
            if (state.selectedList === id) {
                const fallbackIds = Object.keys(state.customLists);
                state.selectedList = fallbackIds.at(-1);

                saveToStorage('listManager', 'selectedList', state.selectedList);
            }
        },
        cloneCustomList(state, action: { payload: string }) {
            const list = state.customLists[action.payload] as CustomList | undefined;
            if (!list) throw new Error(`Cannot clone list "${action.payload}", does not exist`);

            const endingNumber = new RegExp(/-[0-9]+$/g).test(list.name);
            let nameToCheck = list.name;
            let suffix = 1;
            if (endingNumber) {
                const splitName = list.name.split('-');
                nameToCheck = splitName.slice(0, -1).join('-');
                suffix = Number(splitName.at(-1) || '1');
            }

            const listNames = Object.values(state.customLists).map(({ name }) => name);

            while (listNames.includes(`${nameToCheck}-${suffix}`)) suffix++;

            const newId = uuid();

            state.customLists[newId] = { ...list, id: newId, name: `${nameToCheck}-${suffix}` };

            saveToStorage('listManager', 'customLists', state.customLists);

            if (state.selectedList === list.id) {
                state.selectedList = newId;

                saveToStorage('listManager', 'selectedList', state.selectedList);
            }
        },
        setModsConfig(state, action: { payload: ModsConfig }) {
            state.modsConfig = action.payload;
        },
        setSelectedList(state, action: { payload: string | undefined }) {
            if (action.payload === undefined || state.selectedList === action.payload) state.selectedList = undefined;
            else state.selectedList = action.payload;

            saveToStorage('listManager', 'selectedList', state.selectedList);
        },
    },
});

export const { modifyCustomList, deleteCustomList, cloneCustomList, setModsConfig, setSelectedList } =
    listManagerSlice.actions;

export const getCustomLists = (state: StoreState) => state.listManager.customLists;

export const getModsConfig = (state: StoreState) => state.listManager.modsConfig;

export const getSelectedListId = (state: StoreState) => state.listManager.selectedList;

export const getSelectedList = (state: StoreState): CustomList | undefined => {
    if (state.listManager.selectedList) {
        const existing = state.listManager.customLists[state.listManager.selectedList] as CustomList | undefined;
        if (!existing) console.warn(`Selected list "${state.listManager.selectedList}" doesn't exist!`);
        return existing;
    }
};

/** Loads mods and other information from RimWorld's `ModsConfig.xml` file. */
export const loadModsConfig = createAsyncThunk('listManager/loadModsConfig', (_, { getState, dispatch }) => {
    const state = getState() as StoreState;
    const filePath = getFilePaths(state).modlist;

    try {
        const config = window.api.listLoader(filePath);
        dispatch(setModsConfig(config));
    } catch (error) {
        console.log(error);
    }
});

export const exportCustomList = createAsyncThunk('listManager/exportCustomList', (list: CustomList, { getState }) => {
    const state = getState() as StoreState;
    const config = getModsConfig(state);

    if (!config) throw new Error('Cannot export without an existing ModsConfig.xml');

    const filePayload = formatListAsXml({ modlist: list.mods, ...config });

    const blob = new Blob([filePayload], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${list.name}.xml`;
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

export const applyCustomModlist = createAsyncThunk(
    'listManager/applyCustomModlist',
    (list: CustomList, { getState }) => {
        const state = getState() as StoreState;
        const config = getModsConfig(state);

        if (!config) throw new Error('Cannot apply without an existing ModsConfig.xml');

        const filePath = getFilePaths(state).modlist;
        const filePayload = formatListAsXml({ modlist: list.mods, ...config });

        try {
            window.api.listSaver(filePath, filePayload);
        } catch (error) {
            console.log(error);
        }
    },
);

export default listManagerSlice.reducer;
