import { ICloneable } from "../interfaces/ICloneable.js";
import { IComparable } from "../interfaces/IComparable.js";
import { IEquatable } from "../interfaces/IEquatable.js";

export interface IPrimitive<T> extends ICloneable<T>, IEquatable<T> {


}