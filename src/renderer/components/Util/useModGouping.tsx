import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getModGrouping } from '../../redux/slices/main.slice';
import { Mod, ModList, ModSource } from '../../../types/ModFiles';
import ConstructionIcon from '@mui/icons-material/Construction';
import PublicIcon from '@mui/icons-material/Public';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ScienceIcon from '@mui/icons-material/Science';
import CloudIcon from '@mui/icons-material/Cloud';
import { getModLibrary } from '../../redux/slices/modManager.slice';

export interface GroupedMods<T extends ModSource> {
    mods: Mod<T>[];
    title: string;
    icon: JSX.Element;
}

function groupBySource(mods: ModList<ModSource>): [GroupedMods<'core'>, GroupedMods<'local'>, GroupedMods<'workshop'>] {
    const coreMods: GroupedMods<'core'> = {
        mods: [],
        title: 'Core',
        icon: <PublicIcon />,
    };
    const localMods: GroupedMods<'local'> = {
        mods: [],
        title: 'Local Files',
        icon: <FolderIcon />,
    };
    const workshopMods: GroupedMods<'workshop'> = {
        mods: [],
        title: 'Steam Workshop',
        icon: <ConstructionIcon />,
    };

    const map: { [K in ModSource]: GroupedMods<K> } = {
        core: coreMods,
        local: localMods,
        workshop: workshopMods,
    };

    for (const packageId in mods) {
        const mod = mods[packageId];
        map[mod.source].mods.push(mod);
    }

    return [coreMods, localMods, workshopMods];
}

function noGrouping(mods: ModList<ModSource>): GroupedMods<ModSource> {
    const output: GroupedMods<ModSource> = {
        mods: [],
        title: 'All Mods',
        icon: <></>,
    };

    for (const packageId in mods) {
        const mod = mods[packageId];
        output.mods.push(mod);
    }

    return output;
}

function alphabeticalGrouping(mods: ModList<ModSource>): GroupedMods<ModSource> {
    const output: GroupedMods<ModSource> = {
        mods: [],
        title: 'All Mods',
        icon: <></>,
    };

    const sortedPackageIds = Object.keys(mods).sort((a, b) => mods[a].name.localeCompare(mods[b].name));

    sortedPackageIds.forEach((packageId) => {
        output.mods.push(mods[packageId]);
    });

    return output;
}

const customAuthorIcons: { [authorName: string]: JSX.Element } = {
    'Ludeon Studios': <PublicIcon />,
    Owlchemist: <ScienceIcon />,
    VanillaSky: <CloudIcon />,
};

/** Groups mods by author, mods by multiple authors will appear more than once. */
function authorGrouping(mods: ModList<ModSource>, newGroupThreshold: number = 3): GroupedMods<ModSource>[] {
    // const authorGroups: GroupedMods<ModSource>[] = [];

    const authorModAmountsMap: { [authorName: string]: number } = {};

    for (const packageId in mods) {
        const mod = mods[packageId];
        for (const author of mod.authors) {
            if (authorModAmountsMap[author] !== undefined) {
                authorModAmountsMap[author]++;
            } else authorModAmountsMap[author] = 1;
        }
    }

    const authorsWithTheirOwnGroups = Object.keys(authorModAmountsMap).filter(
        (authorName) => authorModAmountsMap[authorName] >= newGroupThreshold,
    );

    const output: { [authorName: string]: GroupedMods<ModSource> } = {};

    const other: GroupedMods<ModSource> = {
        icon: <PersonOutlineIcon />,
        mods: [],
        title: 'Other',
    };

    for (const author of authorsWithTheirOwnGroups) {
        output[author] = {
            icon: customAuthorIcons[author] || <PersonIcon />,
            mods: [],
            title: author,
        };
    }

    for (const packageId in mods) {
        const mod = mods[packageId];
        let foundAuthor = false;
        for (const author of mod.authors) {
            if (output[author]) {
                output[author].mods.push(mod);
                foundAuthor = true;
            }
        }
        if (!foundAuthor) other.mods.push(mod);
    }

    let finalOutput: GroupedMods<ModSource>[] = [];

    for (const author in output) {
        finalOutput.push(output[author]);
    }

    // sort mod authors alphabetically
    finalOutput = finalOutput.sort((groupA, groupB) => groupA.title.localeCompare(groupB.title));

    finalOutput.push(other);

    return finalOutput;
}

function useModGrouping(): GroupedMods<ModSource>[] {
    const [groups, setGroups] = useState<GroupedMods<ModSource>[]>([]);
    const grouping = useSelector(getModGrouping);
    const modLibrary = useSelector(getModLibrary);

    const modSet = useMemo<ModList<ModSource>>(() => {
        const outputSet: ModList<ModSource> = {};

        for (const packageId in modLibrary) {
            const mod = modLibrary[packageId];
            if (!mod.hidden) outputSet[packageId] = mod;
        }

        return outputSet;
    }, [modLibrary]);

    useEffect(() => {
        if (grouping === 'none') {
            setGroups([noGrouping(modSet)]);
        } else if (grouping === 'alphabetical') {
            setGroups([alphabeticalGrouping(modSet)]);
        } else if (grouping === 'author') {
            setGroups(authorGrouping(modSet));
        } else if (grouping === 'source') {
            setGroups(groupBySource(modSet));
        }
    }, [grouping, modSet]);

    return groups;
}

export default useModGrouping;
