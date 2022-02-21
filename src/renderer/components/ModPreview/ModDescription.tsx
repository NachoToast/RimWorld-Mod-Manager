import { Link, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getRimWorldVersion, getRimWorldVersionOverride } from '../../redux/slices/main.slice';
import { ModSource, Mod } from '../../../types/ModFiles';
import Linkify from 'react-linkify';
import { getConfig } from '../../redux/slices/config.slice';

const InlineLink = ({
    decoratedHref,
    decoratedText,
    mod,
}: {
    decoratedHref: string;
    decoratedText: string;
    mod: Mod<ModSource>;
}) => {
    const { booleanDefaultOff: config } = useSelector(getConfig);
    const [overridenLink, setOverridenLink] = useState<string>('');

    useEffect(() => {
        if (decoratedHref.includes('steam')) {
            if (!config.openWorkshopLinksInBrowser) {
                const id = decoratedHref.split('/').at(-1);
                if (id) {
                    setOverridenLink(`steam://url/CommunityFilePage/${mod.steamWorkshopId}`);
                }
            } else {
                setOverridenLink('');
            }
        }
    }, [config.openWorkshopLinksInBrowser, decoratedHref, mod.steamWorkshopId]);

    return (
        <Link target="_blank" href={overridenLink || decoratedHref} rel="noopener">
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

const ModDescription = ({ mod }: { mod: Mod<ModSource> }) => {
    const rimWorldVersion = useSelector(getRimWorldVersion);
    const overridenVersion = useSelector(getRimWorldVersionOverride);
    const finalVersion = overridenVersion ?? rimWorldVersion?.major ?? 0;

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
            <span>
                Supported Versions ({mod.supportedVersions.length}):{' '}
                {mod.supportedVersions.map((version, index) => (
                    <span key={index} style={{ color: version === finalVersion ? 'lightgreen' : 'gray' }}>
                        {version === 1 ? '1.0' : version}
                        <span>{', '}</span>
                    </span>
                ))}
                <br />
            </span>
            <div style={{ whiteSpace: 'pre-wrap' }}>
                <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                        <InlineLink decoratedHref={decoratedHref} decoratedText={decoratedText} mod={mod} key={key} />
                    )}
                >
                    {parseDescription(mod.description)}
                </Linkify>
            </div>
        </div>
    );
};

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