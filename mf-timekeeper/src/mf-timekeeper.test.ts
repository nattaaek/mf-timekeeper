import { describe, it, expect, vi } from 'vitest';
import { getRemoteEntryUrl } from './mf-timekeeper';
import { afterEach } from 'node:test';

// Mock the global fetch function
global.fetch = vi.fn();

// Function to create a fetch response with a delay
const createFetchResponse = (urlDataMap, delay = 0) => {
  return (url) => {
    return new Promise<Response>((resolve) => {
      setTimeout(() => {
        const data = urlDataMap[url] || {}; // Get data for the URL or return an empty object if not found
        resolve(new Response(
          JSON.stringify(data),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        ));
      }, delay);
    });
  };
};

describe('getRemoteEntryUrl', () => {

  describe('on vite bundle', () => {
    afterEach(() => {
      vi.useRealTimers();
    })

    it('should be return remoteEntry from base url with version number', async () => {
      const urlDataMap = {
        'https://api.myendpoint.com?token=1234&currentHost=myCurrentHost&remoteName=myRemoteName': { version: '2024_06_21__09_02', name: "myRemoteName", remoteURL: "https://cdn.mycdn.com/cdn-mf/" },
      };

      vi.mocked(fetch).mockImplementation(await createFetchResponse(urlDataMap, 0))

      const remoteEntry = getRemoteEntryUrl({
        remoteName: 'myRemoteName',
        currentHost: 'myCurrentHost',
        apiUrl: 'https://api.myendpoint.com?token=1234',
        baseUrl: 'https://cdn.mycdn.com/cdn-mf',
        fallbackUrl: 'https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js'
      })

      const remoteEntryFunction = new Function(`return ${remoteEntry}`);
      const remoteEntryResult = await remoteEntryFunction();
      expect(remoteEntryResult).toBe("https://cdn.mycdn.com/cdn-mf/2024_06_21__09_02.remoteEntry.js")
    })

    it('should be return fallback url when api is very slow', async () => {
      const urlDataMap = {
        'https://api.myendpoint.com?token=1234&currentHost=myCurrentHost&remoteName=myRemoteName': { version: '2024_06_21__09_02', name: "myRemoteName", remoteURL: "https://cdn.mycdn.com/cdn-mf/" },
      };

      vi.mocked(fetch).mockImplementation(await createFetchResponse(urlDataMap, 10000))

      const remoteEntry = getRemoteEntryUrl({
        remoteName: 'myRemoteName',
        currentHost: 'myCurrentHost',
        apiUrl: 'https://api.myendpoint.com?token=1234',
        baseUrl: 'https://cdn.mycdn.com/cdn-mf',
        fallbackUrl: 'https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js',
        timeout: 100
      })

      const remoteEntryFunction = new Function(`return ${remoteEntry}`);
      const remoteEntryResult = await remoteEntryFunction();
      expect(remoteEntryResult).contain(`https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js`)
    })

    it('should be return fallback url when api is error', async () => {
      const urlDataMap = {
        'https://api.myendpoint.com?token=1234&currentHost=myCurrentHost&remoteName=myRemoteName': { something_wrong: 'something_wrong' },
      };

      vi.mocked(fetch).mockImplementation(await createFetchResponse(urlDataMap, 10000))

      const remoteEntry = getRemoteEntryUrl({
        remoteName: 'myRemoteName',
        currentHost: 'myCurrentHost',
        apiUrl: 'https://api.myendpoint.com?token=1234',
        baseUrl: 'https://cdn.mycdn.com/cdn-mf',
        fallbackUrl: 'https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js',
        timeout: 100
      })

      const remoteEntryFunction = new Function(`return ${remoteEntry}`);
      const remoteEntryResult = await remoteEntryFunction();
      expect(remoteEntryResult).contain(`https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js`)
    })
  })

  describe('on webpack bundle', () => {
    it('should be return remoteEntry from base url with version number', async () => {
      const urlDataMap = {
        'https://api.myendpoint.com?token=1234&currentHost=myCurrentHost&remoteName=myRemoteName': { version: '2024_06_21__09_02', name: "myRemoteName", remoteURL: "https://cdn.mycdn.com/cdn-mf/" },
        'https://cdn.mycdn.com/cdn-mf/2024_06_21__09_02.remoteEntry.js': `var myRemoteName;(()=>{"use strict"....`,
      };

      vi.mocked(fetch).mockImplementation(await createFetchResponse(urlDataMap, 0))

      const remoteEntry = getRemoteEntryUrl({
        remoteName: 'myRemoteName',
        currentHost: 'myCurrentHost',
        apiUrl: 'https://api.myendpoint.com?token=1234',
        baseUrl: 'https://cdn.mycdn.com/cdn-mf',
        fallbackUrl: 'https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js',
        bundle: "webpack"
      })

      const remoteEntryFunction = new Function(`return ${remoteEntry}`);
      const remoteEntryResult = await remoteEntryFunction();
      expect(remoteEntryResult).toBe("myRemoteName@https://cdn.mycdn.com/cdn-mf/2024_06_21__09_02.remoteEntry.js")
    })

    it('should be return fallback url when api is very slow', async () => {
      const urlDataMap = {
        'https://api.myendpoint.com?token=1234&currentHost=myCurrentHost&remoteName=myRemoteName': { version: '2024_06_21__09_02', name: "myRemoteName", remoteURL: "https://cdn.mycdn.com/cdn-mf/" },
        'https://cdn.mycdn.com/cdn-mf/2024_06_21__09_02.remoteEntry.js': `var myRemoteName;(()=>{"use strict"....`,
      };

      vi.mocked(fetch).mockImplementation(await createFetchResponse(urlDataMap, 10000))

      const remoteEntry = getRemoteEntryUrl({
        remoteName: 'myRemoteName',
        currentHost: 'myCurrentHost',
        apiUrl: 'https://api.myendpoint.com?token=1234',
        baseUrl: 'https://cdn.mycdn.com/cdn-mf',
        fallbackUrl: 'https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js',
        timeout: 100,
        bundle: "webpack"
      })

      const remoteEntryFunction = new Function(`return ${remoteEntry}`);
      const remoteEntryResult = await remoteEntryFunction();
      expect(remoteEntryResult).contain("myRemoteName@https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js")
    })

    it('should be return fallback url when api is error', async () => {
      const urlDataMap = {
        'https://api.myendpoint.com?token=1234&currentHost=myCurrentHost&remoteName=myRemoteName': { something_wrong: 'something_wrong' },
        'https://cdn.mycdn.com/cdn-mf/2024_06_21__09_02.remoteEntry.js': `var myRemoteName;(()=>{"use strict"....`,
      };

      vi.mocked(fetch).mockImplementation(await createFetchResponse(urlDataMap, 10000))

      const remoteEntry = getRemoteEntryUrl({
        remoteName: 'myRemoteName',
        currentHost: 'myCurrentHost',
        apiUrl: 'https://api.myendpoint.com?token=1234',
        baseUrl: 'https://cdn.mycdn.com/cdn-mf',
        fallbackUrl: 'https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js',
        timeout: 100,
        bundle: "webpack"
      })

      const remoteEntryFunction = new Function(`return ${remoteEntry}`);
      const remoteEntryResult = await remoteEntryFunction();
      expect(remoteEntryResult).contain("myRemoteName@https://cdn.mycdn.com/cdn-mf/remoteEntry-deprecated.js")
    })
  })
});
