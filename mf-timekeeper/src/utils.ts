import { GetRemoteEntryOptions } from "./types/options";

export const getRemoteEntryUrl = (options: GetRemoteEntryOptions): string => {
    const { remoteName, currentHost, apiUrl, baseUrl, fallbackUrl, timeout = 3000 } = options

    return `Promise.race([
        fetch(\`${apiUrl}&currentHost=${currentHost}&remoteName=${remoteName}\`).then(response => {
            if (!response.ok) throw new Error('Network response was not ok.');
            return response.json();
        }).then(data => \`${baseUrl}\${data.version}.remoteEntry.js\`),
        new Promise((resolve, reject) => 
            setTimeout(() => resolve(\`${fallbackUrl}?t=\${new Date().getTime()}\`), ${timeout})
        )
    ])
    .catch(error => {
        return \`${fallbackUrl}?t=\${new Date().getTime()}\`;
    })`;
}

export async function updateVersion(apiUrl: string, remoteName: string, version: string): Promise<boolean> {
    const result = await updateVersionMetadata(apiUrl, remoteName, version);
    return result;
}

async function updateVersionMetadata(apiUrl: string, remoteName: string, version: string): Promise<boolean> {
    const metadata = {
        version: version,
        appName: remoteName
    };
    // Update the version metadata on the remote server
    const result = await fetch(`http://${apiUrl}/api/version`, {
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