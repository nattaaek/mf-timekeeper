// MFTimekeeper.ts
import { getCurrentTimestamp } from './utils';
import fetch from 'node-fetch';

interface TimekeeperResponse {
    mf_version: {
        version: string;
        appName: string;
    }
}

export async function getRemoteEntryUrl(baseUrl: string, remoteName: string): Promise<string> {
    const version = await getLatestVersionMetadata(baseUrl, remoteName);
    return `http://${baseUrl}/assets/${version}_remoteEntry.js`;
}

export async function updateVersion(baseUrl: string, remoteName: string, version: string): Promise<boolean> {
    const result = await updateVersionMetadata(baseUrl, remoteName, version);
    return result;
}

async function getLatestVersionMetadata(baseUrl: string, remoteName: string) {
    if (baseUrl) {
        try {
            const response = await fetch(`http://${baseUrl}/api/version/${remoteName}`);
            if (response.ok) {
                const data = await response.json() as TimekeeperResponse;
                console.log(data.toString());
                return data.mf_version.version;
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error("Fetch error:", (error as Error).message);
            return {
                version: getCurrentTimestamp() 
            };
        }
    }
    return {
        version: getCurrentTimestamp()
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