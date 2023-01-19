export declare class Color3 {
    r: number;
    g: number;
    b: number;
    static readonly NUM_COMPONENTS = 3;
    constructor(r?: number, g?: number, b?: number);
    getHashCode(): number;
    clone(result?: Color3): Color3;
    copy(v: Color3): this;
    set(r: number, g: number, b: number): this;
    setComponent(index: number, value: number): this;
    getComponent(index: number): number;
}
//# sourceMappingURL=Color3.d.ts.map