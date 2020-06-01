//
// based on IEquatable from the .NET framework
//
// Authors:
// * @bhouston
//

export interface IEquatable<T> {

    equals(t: T): boolean;

}