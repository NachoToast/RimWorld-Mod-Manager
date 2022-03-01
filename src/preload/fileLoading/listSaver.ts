import { userInfo } from 'os';
import { writeFileSync } from 'fs';

const user = userInfo().username;

export default function saveToRimWorld(modsConfigPath: string, XmlPayload: string) {
    modsConfigPath = modsConfigPath.replace('USERNAME', user);

    writeFileSync(modsConfigPath, XmlPayload, 'utf-8');
}
