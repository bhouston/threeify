//
// based on IVersioned from the Exocortex Managed Libraries
//
// Authors:
// * @bhouston
//

export interface IVersioned {

    version: number;

    dirty(): void;

}