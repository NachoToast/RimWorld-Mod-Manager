import { StoreState } from './store';

const STORAGE_KEY_PREFIX = 'rmm';

export function loadFromStorage<T extends keyof StoreState, K extends keyof StoreState[T]>(
    t: T,
    k: K,
): StoreState[T][K] | null {
    const localItem = localStorage.getItem(`${STORAGE_KEY_PREFIX}.${t}.${k}`);
    if (!localItem) return null;
    try {
        return JSON.parse(localItem) as StoreState[T][K];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function saveToStorage<T extends keyof StoreState, K extends keyof StoreState[T]>(
    t: T,
    k: K,
    v: StoreState[T][K],
) {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}.${t}.${k}`, JSON.stringify(v));
}
