import { createSlice } from '@reduxjs/toolkit';
import { ModSource, ModList, PackageId, Mod } from '../../../types/ModFiles';
import StoreState from '../state';

export interface State {
    /** All recorded mods. */
    modLibrary: ModList<ModSource>;

    modList: {
        packageIds: PackageId[];
        lookup: ModList<ModSource>;
    };
}

export const initialState: State = {
    modLibrary: {},

    modList: {
        packageIds: [],
        lookup: {},
    },
};

const modManagerSlice = createSlice({
    name: 'modManager',
    initialState,
    reducers: {
        /** Clears all mods from the library. */
        clearLibrary(state) {
            state.modLibrary = {};
        },
        /** Adds a single mod the the library. */
        addToLibrary(state, { payload }: { payload: Mod<ModSource> }) {
            const { packageId } = payload;
            state.modLibrary[packageId.toLowerCase()] = payload;
        },
        /** Removes the mod from the library that has the specified PackageId. */
        removeFromLibrary(state, { payload }: { payload: PackageId }) {
            delete state.modLibrary[payload.toLowerCase()];
        },
        /** Removes all mods from the library that match the specified source. */
        removeFromLibraryBySource(state, { payload }: { payload: ModSource }) {
            for (const packageId in state.modLibrary) {
                const mod = state.modLibrary[packageId];
                if (mod.source === payload) {
                    delete state.modLibrary[packageId];
                }
            }
        },
        /** Adds a mod from the library the the modlist, selected via packageId.
         *
         * If the mod isn't in the library, the packageId will still be added,
         * however the lookup table will have no entry.
         *
         * If the mod is already in the modlist, nothing will be done.
         *
         * @param {number} [index] The position to put this mod in the list,
         * if ommitted, will put at the end of the modlist.
         */
        addToModList(state, { payload }: { payload: { packageId: PackageId; index?: number } }) {
            const { packageId, index } = payload;

            const packageLower = packageId.toLocaleLowerCase();

            const mod = state.modLibrary[packageId];

            // if package id not in list yet, add it
            if (state.modList.packageIds.indexOf(packageLower) === -1) {
                if (index) state.modList.packageIds.splice(index, 0, packageLower);
                else state.modList.packageIds.push(packageLower);
            }

            if (mod) {
                state.modList.lookup[packageLower] = mod;
            } else {
                console.warn(`Failed to find mod with PackageId %c${packageId}`, 'color: lightcoral');
            }
        },
    },
});

export const { clearLibrary, addToLibrary, removeFromLibrary, removeFromLibraryBySource, addToModList } =
    modManagerSlice.actions;

export const getModLibrary = (state: StoreState) => state.modManager.modLibrary;
export const getModList = (state: StoreState) => state.modManager.modList;

export default modManagerSlice.reducer;
