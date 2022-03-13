import { Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mod, ModDependency, ModSource, PackageId } from '../../../types/ModFiles';
import {
    addModsToSelectedList,
    getModsConfig,
    getSelectedList,
    modifyCustomList,
} from '../../redux/slices/listManager';
import { setFocussedMod } from '../../redux/slices/main';
import { getModLibrary } from '../../redux/slices/modLibrary';

const Dependency = ({ mod }: { mod: ModDependency }) => {
    const dispatch = useDispatch();
    const modLibrary = useSelector(getModLibrary);
    const selectedList = useSelector(getSelectedList);

    const fullMod = useMemo<Mod<ModSource> | null>(
        () => modLibrary[mod.packageId.toLowerCase()],
        [mod.packageId, modLibrary],
    );

    const isInSelectedList = useMemo<boolean>(
        () => !!selectedList?.mods.includes(mod.packageId.toLowerCase()),
        [mod.packageId, selectedList?.mods],
    );

    const handleSelect = useCallback(() => {
        if (fullMod) dispatch(setFocussedMod(fullMod));
        else window.alert('mod not found');
    }, [dispatch, fullMod]);

    const handleCheck = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isInSelectedList) {
                if (!selectedList) throw new Error("Cant remove mod, selected list doesn't exist");
                const listMods = [...selectedList.mods];
                const index = listMods.indexOf(mod.packageId.toLowerCase());
                if (index === -1) throw new Error(`Mod ${mod.packageId} not actually in selected list`);
                else listMods.splice(index, 1);

                dispatch(modifyCustomList({ ...selectedList, mods: listMods }));
            } else {
                dispatch(addModsToSelectedList({ packageIds: [mod.packageId] }));
            }
        },
        [dispatch, isInSelectedList, mod.packageId, selectedList],
    );

    return (
        <ListItem disablePadding>
            <ListItemButton role={undefined} onClick={handleSelect} dense>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={isInSelectedList}
                        tabIndex={-1}
                        disableRipple
                        onClick={handleCheck}
                    />
                </ListItemIcon>
                <ListItemText primary={`${mod.displayName}`} />
            </ListItemButton>
        </ListItem>
    );
};

const ModDependencies = ({ mod }: { mod: Mod<ModSource> }) => {
    const version = useSelector(getModsConfig)?.version?.major || 1.3;

    const relevantDependencies = useMemo<ModDependency[]>(() => {
        const versionDependencies = mod.modDependenciesByVersion[version] as ModDependency[] | undefined;
        const otherDependencies = mod.modDependencies;

        const dependencyIds: Set<PackageId> = new Set(
            otherDependencies.map(({ packageId }) => packageId.toLowerCase()),
        );
        const combinedDependencies: ModDependency[] = [...otherDependencies];

        // we iteratively add after checking to avoid double-ups
        versionDependencies?.forEach((dependency) => {
            if (!dependencyIds.has(dependency.packageId.toLowerCase())) {
                combinedDependencies.push(dependency);
                dependencyIds.add(dependency.packageId.toLowerCase());
            }
        });

        combinedDependencies.forEach((dep) => {
            combinedDependencies.push(dep);
            combinedDependencies.push(dep);
            combinedDependencies.push(dep);
            combinedDependencies.push(dep);
        });

        return combinedDependencies;
    }, [mod.modDependencies, mod.modDependenciesByVersion, version]);

    if (!relevantDependencies.length) return <></>;

    return (
        <Stack>
            <Typography textAlign="center">
                {relevantDependencies.length} {relevantDependencies.length !== 1 ? 'Dependencies' : 'Dependency'}
            </Typography>
            <List sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {relevantDependencies.map((e, i) => (
                    <Dependency key={i} mod={e} />
                ))}
            </List>
        </Stack>
    );
};

export default ModDependencies;
