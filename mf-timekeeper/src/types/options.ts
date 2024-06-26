/**
* Options for getting the remote entry URL.
*/
export interface GetRemoteEntryOptions {
  /** The name of the remote module. */
  remoteName: string;
  /** The current host name. */
  currentHost: string;
  /** The API URL to fetch the version information. */
  apiUrl: string;
  /** The base URL for the remote entry. */
  baseUrl: string;
  /** The fallback URL to use in case of an error. */
  fallbackUrl: string;
  /** The timeout duration in milliseconds. Optional, defaults to 3000. */
  timeout?: number;
}