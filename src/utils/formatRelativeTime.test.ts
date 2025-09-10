import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatRelativeTime } from './formatRelativeTime.js';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    // Use Vitest's built-in date mocking - this is isolated and won't affect other tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-12-01T06:13:15.672Z'));
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
  });

  it('should return "Just now" for recent times', () => {
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
    expect(formatRelativeTime(thirtySecondsAgo)).toBe('Just now');
  });

  it('should return minutes ago for times less than an hour', () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    expect(formatRelativeTime(thirtyMinutesAgo)).toBe('30 minutes ago');
  });

  it('should return hours ago for times less than a day', () => {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(sixHoursAgo)).toBe('6 hours ago');
  });

  it('should return days ago for times less than a week', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
  });

  it('should return weeks ago for older times', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoWeeksAgo)).toBe('2 weeks ago');
  });
});