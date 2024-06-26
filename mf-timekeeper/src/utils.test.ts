import { vi, describe, it, expect, beforeEach } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { getRemoteEntryUrl } from './utils';
import { GetRemoteEntryOptions } from './types/options';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe('getRemoteEntryUrl', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should be return remoteEntry from base url with version number', async () => {
    const options: GetRemoteEntryOptions = {
      remoteName: 'myRemoteName',
      currentHost: 'myCurrentHost',
      apiUrl: 'https://api.myendpoint.com?token=1234',
      baseUrl: 'https://cdn.mycdn.com/cdn-mf/',
      fallbackUrl: 'https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js',
      timeout: 3000
    };
    const remoteEntry = getRemoteEntryUrl(options)

    fetchMock.mockResponseOnce(JSON.stringify({ version: '2024_06_21__09_02', name: "myRemoteName", remoteURL: "https://cdn.mycdn.com/cdn-mf/" }));

    const remoteEntryFunction = new Function(`return ${remoteEntry};`);
    const remoteEntryResult = await remoteEntryFunction();
    expect(remoteEntryResult).toBe("https://cdn.mycdn.com/cdn-mf/2024_06_21__09_02.remoteEntry.js")
  })

  it('should be return fallback url when api is very slow', async () => {
    const options: GetRemoteEntryOptions = {
      remoteName: 'myRemoteName',
      currentHost: 'myCurrentHost',
      apiUrl: 'https://api.myendpoint.com?token=1234',
      baseUrl: 'https://cdn.mycdn.com/cdn-mf/',
      fallbackUrl: 'https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js',
      timeout: 1000
    };
    const remoteEntry = getRemoteEntryUrl(options)

    fetchMock.mockResponseOnce(() => new Promise(resolve => setTimeout(() => resolve(JSON.stringify({ version: '2024_06_21__09_02', name: "myRemoteName", remoteURL: "https://cdn.mycdn.com/cdn-mf/" })), 10000)));

    const remoteEntryFunction = new Function(`return ${remoteEntry};`);
    const remoteEntryResult = await remoteEntryFunction();
    expect(remoteEntryResult).contain(`https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js`)
  })

  it('should be return fallback url when api is error', async () => {
    const options: GetRemoteEntryOptions = {
      remoteName: 'myRemoteName',
      currentHost: 'myCurrentHost',
      apiUrl: 'https://api.myendpoint.com?token=1234',
      baseUrl: 'https://cdn.mycdn.com/cdn-mf/',
      fallbackUrl: 'https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js',
      timeout: 3000
    };
    const remoteEntry = getRemoteEntryUrl(options)

    fetchMock.mockReject(new Error('error on api'));

    const remoteEntryFunction = new Function(`return ${remoteEntry};`);
    const remoteEntryResult = await remoteEntryFunction();

    expect(remoteEntryResult).contain(`https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js`)
  })
})
