import { RimWorldVersion } from '../../preload/fileLoading/listLoader';
import { PackageId } from '../../types/ModFiles';

interface FormatListAsXmlProps {
    /** Array of mod package ID's, lowercase preferred. */
    modlist: PackageId[];

    /** Full version label (or object containing it), e.g. `1.3.3200 rev726`. */
    version: string | RimWorldVersion;

    /** Array of known expansion Package ID's, lowercase preferred. */
    knownExpansions: PackageId[];

    /** Number of spaces to indent XML blocks (default 2). */
    spacing?: number;
}

/** Converts a modlist and version into a string formatted like `ModsConfig.xml`.
 *
 * For a full props reference see {@link FormatListAsXmlProps the interface}.
 */
function formatListAsXml(props: FormatListAsXmlProps) {
    const mods = props.modlist;
    const version = typeof props.version === 'string' ? props.version : props.version.full;
    const { knownExpansions } = props;
    const spacing = props.spacing ?? 2;

    const xmlOutput: string[] = [
        '<?xml version="1.0" encoding="utf-8"?>',
        `<!-- Generated by RimWorld Mod Manager ${window.api.version} (https://github.com/NachoToast/RimWorld-Mod-Manager) -->`,
        '<ModsConfigData>',
        `${' '.repeat(spacing)}<version>${version}</version>`,
        `${' '.repeat(spacing)}<activeMods>`,
    ];

    mods.forEach((packageId) => {
        xmlOutput.push(`${' '.repeat(2 * spacing)}<li>${packageId}</li>`);
    });
    xmlOutput.push(`${' '.repeat(spacing)}</activeMods>`, `${' '.repeat(spacing)}<knownExpansions>`);

    knownExpansions.forEach((packageId) => {
        xmlOutput.push(`${' '.repeat(2 * spacing)}<li>${packageId}</li>`);
    });

    xmlOutput.push(`${' '.repeat(spacing)}</knownExpansions>`, '</ModsConfigData>');

    return xmlOutput.join('\r\n'); // RimWorld mod manager is windows-only, so carriage return instead of just LF
}

export default formatListAsXml;