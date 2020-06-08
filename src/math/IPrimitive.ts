//
// primitive guarrentees
//
// Authors:
// * @bhouston
//

import {
	ICloneable,
	IEquatable,
	IArrayable,
	IHashable,
} from '../model/interfaces.js';

export interface IPrimitive<T>
	extends ICloneable<T>,
		IEquatable<T>,
		IHashable,
		IArrayable {}
