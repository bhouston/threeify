//
// based on IComparable from the .NET framework
//
// Authors:
// * @bhouston
//

export interface IComparable<T> {

    comparable(a: T, b: T): number;

}