import { ICloneable, IEquatable } from '../interfaces/Standard.js';

export interface IPrimitive<T> extends ICloneable<T>, IEquatable<T> {}
