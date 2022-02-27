import { contextBridge } from 'electron';
import modLoader from './fileLoading/modLoader';
import listLoader from './fileLoading/listLoader';
import { exec } from 'child_process';
import { userInfo } from 'os';

const user = userInfo().username;

function getVersion(): string {
    try {
        const easyVersion = process.env.npm_package_version;
        if (easyVersion) return easyVersion;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const packageJson: object = require('../../package.json');
        const packageVersion = (packageJson as { version?: string })?.version;
        if (packageVersion) return packageVersion;
        throw new Error('Unable to find version from process environment or package.json');
    } catch (error) {
        console.warn(error);
        return 'Unknown';
    }
}

export const api = {
    modLoader,
    listLoader,
    createProcess: (path: string) => {
        exec(`start "" "${path.replace('USERNAME', user)}"`);
    },
    version: getVersion(),
};

contextBridge.exposeInMainWorld('api', api);
