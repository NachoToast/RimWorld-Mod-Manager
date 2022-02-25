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

    hiddenMods: PackageId[];
}

export const initialState: State = {
    modLibrary: {},

    modList: {
        packageIds: [],
        lookup: {},
    },

    hiddenMods: [],
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
                if (mod.originalSource === payload) {
                    delete state.modLibrary[packageId];
                }
            }
        },
        /** Adds an array of mods from the library the the modlist, selected via package ID.
         *
         * Dependencies will also be added unless specified otherwise.
         *
         * If a mod isn't in the library, it will still be added,
         * however the lookup table will have no entry.
         *
         * If a mod is already in the modlist, nothing will change.
         *
         * @param {number} [index] The position start inserting mods into the modlist at.
         * If ommitted, will append to the existing modlist.
         */
        addToModList(
            state,
            {
                payload,
            }: { payload: { packageIds: PackageId[]; index?: number; noDependencies?: boolean; version: number } },
        ) {
            let index = payload.index;
            for (const id of payload.packageIds) {
                const packageId = id.toLowerCase();

                const mod = state.modLibrary[packageId];

                // add dependencies first
                if (mod.modDependencies.length && !payload.noDependencies) {
                    mod.modDependencies.forEach((dep) => {
                        const dependencyId = dep.packageId.toLowerCase();

                        if (!state.modList.packageIds.includes(dependencyId.toLowerCase())) {
                            if (index) {
                                state.modList.packageIds.splice(index, 0, dependencyId.toLowerCase());
                                index++;
                            } else state.modList.packageIds.push(dependencyId.toLowerCase());
                        }

                        const foundDep = state.modLibrary[dependencyId];
                        if (foundDep) state.modList.lookup[dependencyId] = foundDep;
                    });
                }

                // if package id not in list yet, add it
                if (!state.modList.packageIds.includes(packageId)) {
                    if (index) {
                        state.modList.packageIds.splice(index, 0, packageId);
                        index++;
                    } else state.modList.packageIds.push(packageId);
                }

                if (mod) state.modList.lookup[packageId] = mod;
                else console.warn(`Failed to find mod with PackageId %c${packageId}`, 'color: lightcoral');
            }
        },
        clearModList(state) {
            state.modList.lookup = {};
            state.modList.packageIds = [];
        },
        /** Removes an array of mods from the mod list that have the specified Package ID. */
        removeFromModList(state, { payload }: { payload: PackageId[] }) {
            for (const id of payload) {
                const packageId = id.toLowerCase();
                delete state.modList.lookup[packageId];
                const index = state.modList.packageIds.indexOf(packageId);
                if (index !== -1) {
                    state.modList.packageIds.splice(index, 1);
                }
            }
        },
        /** Sets mods with the specified package IDs to hidden,
         * unhides all other mods.
         */
        setHidden(state, { payload }: { payload: PackageId[] }) {
            for (const packageId of state.hiddenMods) {
                state.modLibrary[packageId.toLowerCase()].hidden = false;
            }
            for (const packageId of payload) {
                state.modLibrary[packageId.toLowerCase()].hidden = true;
                state.hiddenMods.push(packageId.toLowerCase());
            }
        },
    },
});

export const {
    clearLibrary,
    addToLibrary,
    removeFromLibrary,
    removeFromLibraryBySource,
    addToModList,
    clearModList,
    removeFromModList,
    setHidden,
} = modManagerSlice.actions;

export const getModLibrary = (state: StoreState) => state.modManager.modLibrary;
export const getModList = (state: StoreState) => state.modManager.modList;

export default modManagerSlice.reducer;
