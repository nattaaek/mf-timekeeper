import { describe, it, expect, vi } from 'vitest';
import getRemoteEntryUrl from './mf-timekeeper';
import { getCurrentTimestamp } from './utils';

vi.mock('./utils', () => ({
  getCurrentTimestamp: vi.fn().mockReturnValue("20230421_120000")
}));

describe('getRemoteEntryUrl', () => {
  it('returns a correctly formatted URL', async () => {
    const url = await getRemoteEntryUrl('localhost:4174', 'remoteApp');
    expect(url).toBe('http://localhost:4174/assets/20230421_120000_remoteAppremoteEntry.js');
  });

  it('should handle errors in timestamp generation', async () => {
    vi.mocked(getCurrentTimestamp).mockImplementationOnce(() => {
      throw new Error('Failed to generate timestamp');
    });
    await expect(getRemoteEntryUrl('localhost:4174', 'remoteApp')).rejects.toThrow('Failed to generate timestamp');
  });
});
