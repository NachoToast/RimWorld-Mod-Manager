import { contextBridge } from 'electron';
import modLoader from './fileLoading/modLoader';
import listLoader from './fileLoading/listLoader';
import { exec } from 'child_process';

export const api = {
    modLoader,
    listLoader,
    createProcess: (path: string) => {
        exec(`start "" "${path}"`);
    },
};

contextBridge.exposeInMainWorld('api', api);
