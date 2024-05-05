// MFTimekeeper.ts
import { getCurrentTimestamp } from './utils';

interface TimekeeperResponse {
    mf_version: {
        version: string;
        appName: string;
    }
}

export async function getRemoteEntryUrl(baseUrl: string, remoteName: string): Promise<string> {
    const metadata = await getLatestVersionMetadata(baseUrl, remoteName);
    return `http://${baseUrl}/assets/${metadata.version}_remoteEntry.js`;
}

export async function updateVersion(baseUrl: string, remoteName: string, version: string): Promise<boolean> {
    const result = await updateVersionMetadata(baseUrl, remoteName, version);
    return result;
}

async function getLatestVersionMetadata(baseUrl: string, remoteName: string): Promise<{ version: string }> {
    if (baseUrl) {
        const response = await fetch(`http://${baseUrl}/api/version/${remoteName}`);
        response.json().then((data: TimekeeperResponse) => {
            return data.mf_version.version
        });
    }

    return {
        version: getCurrentTimestamp()  // Return the timestamp as a string version identifier
    };
}

async function updateVersionMetadata(baseUrl: string, remoteName: string, version: string): Promise<boolean> {
    const metadata = {
        version: version,
        appName: remoteName
    };
    // Update the version metadata on the remote server
    const result = await fetch(`http://${baseUrl}/api/version`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
    });

    if (!result.ok) {
        throw new Error('Failed to update version metadata');
    }

    return true;
}