// MFTimekeeper.ts
import { getCurrentTimestamp } from './utils';

export default async function getRemoteEntryUrl(baseUrl: string, remoteName: string): Promise<string> {
    const metadata = await getLatestVersionMetadata(baseUrl, remoteName);
    return `http://${baseUrl}/assets/${metadata.version}_${remoteName}remoteEntry.js`;
}

async function getLatestVersionMetadata(baseUrl: string, remoteName: string): Promise<{ version: string }> {
    // Ideally, here you would actually fetch this data from a remote server or database
    return {
        version: getCurrentTimestamp()  // Return the timestamp as a string version identifier
    };
}
