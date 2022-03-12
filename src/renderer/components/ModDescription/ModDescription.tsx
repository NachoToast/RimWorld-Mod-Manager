import { Link } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import Linkify from 'react-linkify';
import { Mod, ModSource } from '../../../types/ModFiles';
import useSteamLinkOverriding from '../../hooks/useSteamLinkOverriding';

interface InlineLinkProps {
    decoratedHref: string;
    decoratedText: string;
    mod: Mod<ModSource>;
}
const InlineLink = ({ decoratedHref, decoratedText, mod }: InlineLinkProps) => {
    const finalLink = useSteamLinkOverriding(decoratedHref, mod.steamWorkshopId);

    return (
        <Link target="_blank" href={finalLink} rel="noopener">
            {decoratedText}
        </Link>
    );
};

const ModDescription = ({ mod }: { mod: Mod<ModSource> }) => {
    const decorator = useCallback(() => {
        return (decoratedHref: string, decoratedText: string, key: number) => (
            <InlineLink decoratedHref={decoratedHref} decoratedText={decoratedText} key={key} mod={mod} />
        );
    }, [mod]);

    const formatted = useMemo<JSX.Element>(() => wrapParseDescription(mod.description), [mod.description]);

    return (
        <div style={{ whiteSpace: 'pre-wrap' }}>
            <Linkify componentDecorator={decorator()}>{formatted}</Linkify>
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
    let lastString: string | undefined;

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

            if (lastString) {
                content.push(<span key={i}>{lastString}</span>);
                lastString = undefined;
            }
            content.push(element);

            i = closingTagIndex + `</${tagName}>`.length;
        } else if (char === '\\' && i < desc.length - 1 && desc[i + 1] === 'n') {
            if (lastString) {
                content.push(<span key={i}>{lastString}</span>);
                lastString = undefined;
            }
            content.push(<br key={i} />);
            i += 2;
        } else {
            if (lastString) lastString += desc[i];
            else lastString = desc[i];
            i++;
        }
    }

    if (lastString) content.push(<span key={content.length}>{lastString}</span>);

    return <>{content}</>;
}

export default ModDescription;
