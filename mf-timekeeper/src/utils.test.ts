import { describe, it, expect, vi } from 'vitest';
import { getCurrentTimestamp } from './utils';

describe('getCurrentTimestamp', () => {
  it('returns a timestamp string in the expected format YYYYMMDD_HHMMSS', () => {
    const timestamp = getCurrentTimestamp();
    expect(timestamp).toMatch(/^\d{8}_\d{6}$/);
    const parts = timestamp.split('_');
    expect(parts[0]).toHaveLength(8); // YYYYMMDD
    expect(parts[1]).toHaveLength(6); // HHMMSS
  });

  it('adjusts month correctly', () => {
    vi.useFakeTimers().setSystemTime(new Date('2023-04-21T12:00:00Z'));
    const timestamp = getCurrentTimestamp();
    expect(timestamp.startsWith('20230421')).toBe(true);
    vi.useRealTimers();
  });
});
