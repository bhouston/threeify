export type Color3JSON = number[];

export class Color3 {
  constructor(
    public r: number = 0,
    public g: number = 0,
    public b: number = 0
  ) {}

  getHashCode(): number {
    return hashFloat3(this.r, this.g, this.b);
  }

  clone(result = new Color3()): Color3 {
    return result.set(this.r, this.g, this.b);
  }

  set(r: number, g: number, b: number): this {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }
}
