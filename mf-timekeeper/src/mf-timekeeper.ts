/**
* Options for getting the remote entry URL.
*/
export interface GetRemoteEntryOptions {
    /** The name of the remote module. */
    remoteName: string;
    /** The current host name. */
    currentHost: string;
    /** The version of the remote module. */
    version?: string;
    /** The API URL to fetch the version information. */
    apiUrl: string;
    /** The base URL for the remote entry. */
    baseUrl: string;
    /** The fallback URL to use in case of an error. */
    fallbackUrl: string;
    /** The timeout duration in milliseconds. Optional, defaults to 3000. */
    timeout?: number;
    /** The build tool used, either 'vite' or 'webpack'. Optional, defaults to 'vite'. */
    bundle?: "vite" | "webpack";
}
/**
 * Generates the remote entry URL based on the provided options.
 * 
 * @param options - The options for generating the remote entry URL.
 * @returns The JavaScript code as a string to fetch the remote entry URL.
 */
export function getRemoteEntryUrl(options: GetRemoteEntryOptions): string {
    const { 
        remoteName,  // The name of the remote module.
        currentHost,  // The current host name.
        version,  // The version of the remote module.
        apiUrl,  // The API URL to fetch the version information.
        baseUrl,  // The base URL for the remote entry.
        fallbackUrl,  // The fallback URL to use in case of an error.
        timeout = 3000,  // The timeout duration in milliseconds. Defaults to 3000 if not provided.
        bundle = "vite"  // The build tool used, either 'vite' or 'webpack'. Defaults to 'vite' if not provided.
    } = options;

    if (bundle == "webpack") {
        return `Promise.race([
            new Promise((resolve) => {
                fetch(\`${apiUrl}&currentHost=${currentHost}&remoteName=${remoteName}\`)
                .then(response => response.json())
                .then(data => {
                    const version = data.version;
                    const fileName = \`${baseUrl}/\${version}.remoteEntry.js\`;

                    return fetch(fileName).then(response => response.text()).then(fileContent => {
                        console.log("fileContent", fileContent);
                        const variableNameMatch = fileContent.match(/var\\s+(\\w+)\\s*;/);
                        if (variableNameMatch) {
                            const variableName = variableNameMatch[1];
                            resolve(\`\${variableName}@${baseUrl}/\${version}.remoteEntry.js\`);
                        } else {
                            throw new Error('Variable name not found in the file content.');
                        }
                    });
                })
            }),
            new Promise((resolve, reject) => 
                setTimeout(() => resolve(\`${remoteName}@${fallbackUrl}?t=\${new Date().getTime()}\`), ${timeout})
            )
        ])
        .catch(error => {
            resolve(\`${remoteName}@${fallbackUrl}?t=\${new Date().getTime()}\`);
        });`;
    }

    return `Promise.race([
                fetch(\`${apiUrl}&currentHost=${currentHost}&remoteName=${remoteName}\`).then(response => {
                    if (!response.ok) throw new Error('Network response was not ok.');
                    return response.json();
                }).then(data => \`${baseUrl}/\${data.version}.remoteEntry.js\`),
                new Promise((resolve, reject) => 
                    setTimeout(() => resolve(\`${fallbackUrl}?t=\${new Date().getTime()}\`), ${timeout})
                )
            ])
            .catch(error => {
                return \`${fallbackUrl}?t=\${new Date().getTime()}\`;
            });`;
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