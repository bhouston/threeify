//
// based on the .NET framework
//
// Authors:
// * @bhouston
//

export interface ICloneable<T> {
  clone(): T;
}

export interface ICopyable<T> {
  copy(t: T): T;
}

export interface IComparable<T> {
  comparable(a: T, b: T): number;
}

export interface IEquatable<T> {
  equals(t: T): boolean;
}

export interface IDisposable {
  dispose(): void;
}

export interface IIdentifiable {
  id: string;
}

export interface IVersionable {
  version: number;
  dirty(): void;
}

export interface IArrayable {
  setFromArray(floatArray: Float32Array, offset: number): void;
  toArray(floatArray: Float32Array, offset: number): void;
}

export interface Dictionary<T> {
  [key: string]: T;
}
