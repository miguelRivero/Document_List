import { compareSemver } from './semver';

describe('compareSemver', () => {
  it('returns 0 for equal versions', () => {
    expect(compareSemver('1.2.3', '1.2.3')).toBe(0);
  });
  it('returns -1 if a > b', () => {
    expect(compareSemver('2.0.0', '1.9.9')).toBe(-1);
    expect(compareSemver('1.10.0', '1.2.0')).toBe(-1);
  });
  it('returns 1 if a < b', () => {
    expect(compareSemver('1.2.3', '2.0.0')).toBe(1);
    expect(compareSemver('1.2.0', '1.10.0')).toBe(1);
  });
});
