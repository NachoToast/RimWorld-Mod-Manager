import { contextBridge } from 'electron';
import modLoader from './fileLoading/modLoader';
import { exec } from 'child_process';

export const api = {
    modLoader,
    createProcess: (path: string) => {
        exec(`start "" "${path}"`);
    },
};

contextBridge.exposeInMainWorld('api', api);
