export declare function clamp(value: number, min: number, max: number): number;
export declare function lerp(a: number, b: number, t: number): number;
export declare function delta(a: number, b: number): number;
export declare function degToRad(degrees: number): number;
export declare function radToDeg(radian: number): number;
export declare function isPow2(value: number): boolean;
export declare function ceilPow2(value: number): number;
export declare function floorPow2(value: number): number;
export declare function parseSafeFloat(text: string, fallback?: number): number;
export declare function parseSafeFloats(text: string, fallback?: number): number[];
export declare function toSafeString(elements: number[]): string;
export declare const EPSILON = 0.000001;
export declare function equalsTolerance(a: number, b: number, tolerance?: number): boolean;
export declare function equalsAutoTolerance(a: number, b: number): boolean;
//# sourceMappingURL=Functions.d.ts.map