export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}
export function delta(a, b) {
    return Math.abs(a - b);
}
export function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}
export function radToDeg(radian) {
    return radian * (180 / Math.PI);
}
export function isPow2(value) {
    return (value & (value - 1)) === 0 && value !== 0;
}
export function ceilPow2(value) {
    return 2 ** Math.ceil(Math.log2(value));
}
export function floorPow2(value) {
    return 2 ** Math.floor(Math.log2(value));
}
const cSeparator = /[^\d+.-]+/;
export function parseSafeFloat(text, fallback = 0) {
    try {
        return Number.parseFloat(text);
    }
    catch {
        return fallback;
    }
}
export function parseSafeFloats(text, fallback = 0) {
    return text
        .split(cSeparator)
        .filter(Boolean)
        .map((value) => parseSafeFloat(value, fallback));
}
export function toSafeString(elements) {
    return `[${elements.join(',')}]`;
}
export const EPSILON = 0.000001;
export function equalsTolerance(a, b, tolerance = EPSILON) {
    return Math.abs(a - b) < tolerance;
}
export function equalsAutoTolerance(a, b) {
    return Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
}
//# sourceMappingURL=Functions.js.map