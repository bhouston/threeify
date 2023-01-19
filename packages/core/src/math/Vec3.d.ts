export declare class Vec3 {
    x: number;
    y: number;
    z: number;
    static readonly NUM_COMPONENTS = 3;
    constructor(x?: number, y?: number, z?: number);
    getHashCode(): number;
    clone(result?: Vec3): Vec3;
    copy(v: Vec3): this;
    set(x: number, y: number, z: number): this;
    setComponent(index: number, value: number): this;
    getComponent(index: number): number;
}
//# sourceMappingURL=Vec3.d.ts.map