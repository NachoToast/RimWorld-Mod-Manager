import Config from '../../types/Config';
import { storageKeyPrefix, defaultConfig } from '../constants';

export function saveConfig(key: keyof Config, value: unknown): void {
    localStorage.setItem(`${storageKeyPrefix}${key}`, JSON.stringify(value));
}

export function loadConfig(key: keyof Config) {
    const localItem = localStorage.getItem(`${storageKeyPrefix}${key}`);
    if (localItem !== null) {
        try {
            return JSON.parse(localItem);
        } catch (error) {
            //
        }
    }
    return defaultConfig[key];
}

/** Config loaded from localStorage, with the default config object being
 * used as a fallback if a value does not exist.
 *
 * Only to be used on initial load.
 */
export const loadedInConfig: Config = (() => {
    const loaded: Config = {} as Config;
    for (const k in defaultConfig) {
        const key = k as keyof Config;
        loaded[key] = loadConfig(key);
    }
    return loaded;
})();

export default defaultConfig;
