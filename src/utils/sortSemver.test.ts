import { sortSemver } from './sortSemver.js';

describe('sortSemver', () => {
  it('returns 0 for equal versions', () => {
    expect(sortSemver('1.2.3', '1.2.3')).toBe(0);
  });
  it('returns -1 if a < b', () => {
    expect(sortSemver('1.9.9', '2.0.0')).toBe(-1);
    expect(sortSemver('1.2.0', '1.10.0')).toBe(-1);
  });
  it('returns 1 if a > b', () => {
    expect(sortSemver('2.0.0', '1.2.3')).toBe(1);
    expect(sortSemver('1.10.0', '1.2.0')).toBe(1);
  });
});
