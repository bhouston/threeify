//
// primitive guarrentees
//
// Authors:
// * @bhouston
//

import { IArrayable, ICloneable, IEquatable, IHashable } from "../model/interfaces";

export interface IPrimitive<T> extends ICloneable<T>, IEquatable<T>, IHashable, IArrayable {}
