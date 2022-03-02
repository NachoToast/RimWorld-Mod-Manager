import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useRimWorldVersion from '../../../../hooks/useRimWorldVersion';
import { getModList, removeFromModList, addToModList } from '../../../../redux/slices/modManager';
import { Mod, ModSource, ModDependency, PackageId } from '../../../../../types/ModFiles';
import {
    Box,
    Typography,
    Fade,
    Tooltip,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Checkbox,
    ListItemText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const DependencyList = ({ mod }: { mod: Mod<ModSource> }) => {
    const dispatch = useDispatch();
    const modList = useSelector(getModList);
    const version = useRimWorldVersion();

    const [deps, ids]: [deps: ModDependency[], ids: Set<PackageId>] = useMemo(() => {
        const deps: ModDependency[] = [];
        const ids: Set<PackageId> = new Set();

        const { modDependencies, modDependenciesByVersion } = mod;

        modDependenciesByVersion[version]?.forEach((e) => {
            if (!ids.has(e.packageId)) {
                ids.add(e.packageId);
                deps.push(e);
            }
        });

        modDependencies.forEach((e) => {
            if (!ids.has(e.packageId)) {
                ids.add(e.packageId);
                deps.push(e);
            }
        });

        return [deps, ids];
    }, [mod, version]);

    const isInModList = useCallback((id: PackageId) => !!modList.lookup[id.toLowerCase()], [modList.lookup]);

    const canAddAll = useCallback(() => {
        if (!deps.length) return false;
        const numInModList = deps.filter(({ packageId }) => isInModList(packageId)).length;
        if (numInModList >= deps.length - 1) return false;
        return true;
    }, [deps, isInModList]);

    if (!deps.length) return <></>;

    const toggleDep = (id: PackageId) => {
        if (isInModList(id)) dispatch(removeFromModList([id]));
        else dispatch(addToModList({ packageIds: [id], version }));
    };

    const addAll = () => dispatch(addToModList({ packageIds: Array.from(ids), version }));

    return (
        <Box>
            <Typography>
                Dependencies ({deps.length}){' '}
                <Fade in={canAddAll()}>
                    <Tooltip title="Add all">
                        <Button onClick={() => addAll()}>
                            <AddIcon />
                        </Button>
                    </Tooltip>
                </Fade>
            </Typography>
            <List>
                {deps.map((dep, index) => (
                    <ListItem disablePadding key={index}>
                        <ListItemButton role={undefined} onClick={() => toggleDep(dep.packageId)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={isInModList(dep.packageId)}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText primary={dep.displayName} secondary={dep.packageId} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default DependencyList;
