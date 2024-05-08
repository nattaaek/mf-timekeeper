export function getRemoteEntryUrl(baseUrl: string, apiUrl: string, fallbackUrl: string, timeout = 5000): string {
    return `
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ${timeout});

    fetch('${apiUrl}')
        .then(response => response.json())
        .then(data => \`http://${baseUrl}/\${data.version}_remoteEntry.js\`)
        .catch(error => {
            console.error('Error fetching version:', error);
            return 'http://${fallbackUrl}?/\${new Date().getTime()}';
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