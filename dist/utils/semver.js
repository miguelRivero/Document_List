// Utility functions for comparing semver versions
/**
 * Compare two semver versions (e.g. "4.9.8" vs "4.10.0").
 * Returns -1 if a > b, 1 if a < b, 0 if equal (descending order).
 */
export function compareSemver(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0;
        const nb = pb[i] || 0;
        if (na > nb)
            return -1;
        if (na < nb)
            return 1;
    }
    return 0;
}
