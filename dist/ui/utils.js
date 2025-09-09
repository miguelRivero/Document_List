// Funciones utilitarias para UI
/**
 * Compara dos versiones semver (ej: "4.9.8" vs "4.10.0").
 * Devuelve -1 si a > b, 1 si a < b, 0 si iguales (orden descendente).
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
