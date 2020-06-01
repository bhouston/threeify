//
// based on the .NET framework
//
// Authors:
// * @bhouston
//

export interface ICloneable<T> {

    clone(): T;

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

export interface IVersionable {

    version: number;

    dirty(): void;

}