import { Stack, Typography } from '@mui/material';
import React from 'react';
import { ModSource, Mod } from '../../../../types/ModFiles';
import Linkify from 'react-linkify';
import useRimWorldVersion from '../../../hooks/useRimWorldVersion';
import InlineLink from './InlineLink';
import ImageCarousel from './ImageCarousel';
import DependencyList from './DependencyList';

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
            <DependencyList mod={mod} />
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
