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
  disposed: boolean;
  dispose(): void;
}

export interface IIdentifiable {
  uuid: string;
}

export interface IVersionable {
  version: number;
  dirty(): void;
}

export interface IHashable {
  getHashCode(): number;
}

export interface IArrayable {
  setFromArray(floatArray: Float32Array, offset: number): void;
  toArray(floatArray: Float32Array, offset: number): void;
}

export interface Dictionary<T> {
  [key: string]: T;
}
