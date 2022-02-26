import Config from '../../types/Config';
import { configKeyPrefix, defaultConfig } from '../constants/defaultConfig';

export function saveConfig(key: keyof Config, value: unknown): void {
    localStorage.setItem(`${configKeyPrefix}${key}`, JSON.stringify(value));
}

export function loadConfig(key: keyof Config) {
    const localItem = localStorage.getItem(`${configKeyPrefix}${key}`);
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
