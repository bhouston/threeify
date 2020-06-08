//
// primitive guarrentees
//
// Authors:
// * @bhouston
//

import { IArrayable, ICloneable, IEquatable, IHashable } from "../types/types";

export interface IPrimitive<T> extends ICloneable<T>, IEquatable<T>, IHashable, IArrayable {}
