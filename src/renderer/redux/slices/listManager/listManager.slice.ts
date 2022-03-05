import { defaultList, storageKeyPrefix } from '../../../constants';
import SaveList from '../../../../types/SavedList';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StoreState } from '../../store';
import { addToModList, clearModList, getModList } from '../modManager';

function saveToStorage(key: keyof State, value: unknown): void {
    localStorage.setItem(`${storageKeyPrefix}${key}`, JSON.stringify(value));
}

function loadFromStorage<T>(key: keyof State, fallback: T): T {
    const localItem = localStorage.getItem(`${storageKeyPrefix}${key}`);
    if (localItem !== null) {
        try {
            return JSON.parse(localItem) as T;
        } catch (error) {
            //
        }
    }
    return fallback;
}

export interface State {
    lists: Record<string, SaveList>;
    currentList: string | null;
}

export const initialState: State = {
    lists: loadFromStorage<State['lists']>('lists', {}),
    currentList: null,
};

const listManagerSlice = createSlice({
    name: 'listManager',
    initialState,
    reducers: {
        addList(state, { payload }: { payload: SaveList }) {
            state.lists[payload.name] = payload;

            saveToStorage('lists', state.lists);
        },
        removeList(state, { payload }: { payload: string }) {
            if (payload === defaultList.name) throw new Error('Cannot delete the default list');
            delete state.lists[payload];

            saveToStorage('lists', state.lists);

            if (payload === state.currentList) {
                const nextAvailableList = Object.keys(state.lists)
                    .reverse()
                    .find((name) => name !== defaultList.name);
                state.currentList = nextAvailableList || defaultList.name;
            }
        },
        modifyList(state, { payload }: { payload: { oldListName: string; newList: SaveList } }) {
            delete state.lists[payload.oldListName];
            state.lists[payload.newList.name] = payload.newList;
            state.lists[payload.newList.name].lastModified = Date.now();

            if (payload.oldListName === state.currentList) {
                state.currentList = payload.newList.name;
            }

            saveToStorage('lists', state.lists);
        },
        setCurrentList(state, { payload }: { payload: string }) {
            state.currentList = payload || null;
        },
    },
});

export const { addList, removeList, modifyList, setCurrentList } = listManagerSlice.actions;

export const getLists = (state: StoreState) => state.listManager.lists;
export const getCurrentList = (state: StoreState) => {
    const existing = state.listManager.lists[state.listManager.currentList || defaultList.name];
    return (
        existing || { name: 'Unknown List', description: '', mods: [], lastModified: Date.now(), createdAt: Date.now() }
    );
};

export const saveModsToList = createAsyncThunk(
    'listManager/saveModsToList',
    (listName: string, { getState, dispatch }) => {
        const state = getState() as StoreState;
        const mods = getModList(state);
        const existingList = getLists(state)[listName] as SaveList | undefined;

        if (existingList) {
            // saving mods to existing list = modify it
            dispatch(
                modifyList({
                    oldListName: listName,
                    newList: { ...existingList, mods: mods.packageIds, lastModified: Date.now() },
                }),
            );
        } else {
            // otherwise save using current list details
            const currentList = getCurrentList(state);
            if (!currentList) throw new Error('Tried to save modlist without any current list');
            dispatch(addList({ ...currentList, mods: mods.packageIds, lastModified: Date.now() }));
        }
    },
);

export const loadModsFromList = createAsyncThunk(
    'listManager/loadModsFromList',
    (listName: string, { getState, dispatch }) => {
        const state = getState() as StoreState;
        const list = getLists(state)[listName] as SaveList | undefined;
        if (!list) throw new Error(`Tried to load mods from non-existant list '${listName}'`);

        dispatch(setCurrentList(listName));
        dispatch(clearModList());
        dispatch(addToModList({ packageIds: list.mods, version: list.version }));
    },
);

export default listManagerSlice.reducer;