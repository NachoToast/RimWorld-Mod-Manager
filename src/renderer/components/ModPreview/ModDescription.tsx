import {
    Box,
    Button,
    Checkbox,
    Fade,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModSource, Mod, ModDependency, PackageId } from '../../../types/ModFiles';
import Linkify from 'react-linkify';
import { addToModList, getModList, removeFromModList } from '../../redux/slices/modManager.slice';
import AddIcon from '@mui/icons-material/Add';
import useRimWorldVersion from '../../hooks/useRimWorldVersion';
import useSteamLinkOverriding from '../../hooks/useSteamLinkOverriding';

const InlineLink = ({
    decoratedHref,
    decoratedText,
    mod,
}: {
    decoratedHref: string;
    decoratedText: string;
    mod: Mod<ModSource>;
}) => {
    const finalLink = useSteamLinkOverriding(decoratedHref, mod.steamWorkshopId);

    return (
        <Link target="_blank" href={finalLink} rel="noopener">
            {decoratedText}
        </Link>
    );
};

const ImageCarousel = ({ images }: { images: string[] }) => {
    if (images.length === 0) return <></>;
    if (images.length === 1)
        return <img src={images[0]} style={{ maxWidth: '100%', maxHeight: 400, alignSelf: 'center' }} />;

    return (
        <Stack
            id="mod-preview-image-carousel"
            direction="row"
            spacing={1}
            sx={{ maxWidth: '100%', overflowX: 'auto', maxHeight: 400 }}
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            {images.map((src, index) => (
                <img src={src} key={index} style={{ maxHeight: '100%' }} />
            ))}
        </Stack>
    );
};

const ModDependencies = ({ mod }: { mod: Mod<ModSource> }) => {
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

const ModDescription = ({ mod }: { mod: Mod<ModSource> }) => {
    const version = useRimWorldVersion();

    const chosenDescription = mod.descriptionsByVersion[version] || mod.description;

    return (
        <div>
            <Typography variant="h6" textAlign="center">
                {mod.name}
            </Typography>
            <Stack sx={{ width: '100%' }} direction="row" justifyContent="space-between">
                <Typography textAlign="left">{mod.authors.join(', ')}</Typography>
                <Typography textAlign="right" color="gray">
                    {mod.packageId}
                </Typography>
            </Stack>
            <Stack sx={{ width: '100%', maxHeight: 400 }} direction="row" justifyContent="center">
                <ImageCarousel images={mod.previewImages} />
            </Stack>
            {!!mod.supportedVersions.length && (
                <span>
                    Supported Versions ({mod.supportedVersions.length}):{' '}
                    {mod.supportedVersions.map((modVersion, index) => (
                        <span key={index} style={{ color: modVersion === version ? 'lightgreen' : 'gray' }}>
                            {modVersion === 1 ? '1.0' : modVersion}
                            {', '}
                        </span>
                    ))}
                    <br />
                </span>
            )}
            <div style={{ whiteSpace: 'pre-wrap' }}>
                <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                        <InlineLink decoratedHref={decoratedHref} decoratedText={decoratedText} mod={mod} key={key} />
                    )}
                >
                    {wrapParseDescription(chosenDescription)}
                </Linkify>
            </div>
            <ModDependencies mod={mod} />
        </div>
    );
};

const charMap: { [index: string]: string } = {
    '&amp;': '', // xml artifact
    'lt;': '<',
    'gt;': '>',
};

/** Parses HTML escape characters (e.g. `&amp;`) to their string equivalents,
 * before feeding the result through the
 * {@link parseDescription} function.
 */
function wrapParseDescription(desc: string): JSX.Element {
    for (const char in charMap) {
        desc = desc.replaceAll(char, charMap[char]);
    }
    return parseDescription(desc);
}

/** Recursively parses known xml tags to JSX.
 *
 * @param {string} desc - The string to search for tags in.
 *
 * Currently supported tags:
 * - \<b>
 * - \<color>
 * - \<size>
 * - \<i>
 */
function parseDescription(desc: string): JSX.Element {
    const content: JSX.Element[] = [];
    let lastString = '';

    let i = 0;
    while (i < desc.length) {
        const char = desc[i];
        if (char === '<') {
            // xml tag of some kind
            const openingTag = desc.slice(i, desc.indexOf('>', i) + 1);
            // currently we only account for 1 tag prop, this should be fine 99.99% of the time
            const [tagName, tagProps] = openingTag.slice(1, -1).split('=') as [string, string | undefined];
            const closingTagIndex = desc.indexOf(`</${tagName}>`, i);

            if (closingTagIndex === -1) {
                // some tags are just put for explanation purposes, e.g. the 'dress patients' mod
                // has the following sentence in its description:
                // "... right click on the patient and choose "Dress <name>" from the ..."
                lastString += char;
                i++;
                continue;
            }

            const xmlContent = desc.slice(i + openingTag.length, closingTagIndex);
            const parsed = parseDescription(xmlContent);

            let element: JSX.Element;

            switch (tagName) {
                case 'b':
                    element = <b key={i}>{parsed}</b>;
                    break;
                case 'color':
                    element = (
                        <span key={i} style={{ color: tagProps }}>
                            {parsed}
                        </span>
                    );
                    break;
                case 'size':
                    element = (
                        <span key={i} style={{ fontSize: tagProps + 'px' }}>
                            {parsed}
                        </span>
                    );
                    break;
                case 'i':
                    element = <i key={i}>{parsed}</i>;
                    break;
                default:
                    console.warn(`Uncaught tag: ${tagName}${tagProps ? ` (with props: ${tagProps})` : ''}`);
                    element = <span key={i}>{parsed}</span>;
                    break;
            }

            content.push(<span key={i}>{lastString}</span>);
            content.push(element);
            lastString = '';

            i = closingTagIndex + `</${tagName}>`.length;
        } else {
            lastString += desc[i];
            i++;
        }
    }

    if (lastString.length) content.push(<span key={content.length}>{lastString}</span>);

    return <>{content}</>;
}

export default ModDescription;
