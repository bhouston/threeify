//
// primitive guarrentees
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable, IArrayable, IHashable } from '../interfaces/Standard.js';

export interface IPrimitive<T>
	extends ICloneable<T>,
		IEquatable<T>,
		IHashable,
		IArrayable {}
