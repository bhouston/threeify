//
// based on Mesh from glTF
//
// Authors:
// * @bhouston
//

import { IDisposable, IVersionable } from '../interfaces/Standard.js';
import { AttributeAccessor } from './AttributeAccessor.js';

class NamedAttributeAccessor {
	name: string;
	attributeAccessor: AttributeAccessor;

	constructor(name: string, attributeAccessor: AttributeAccessor) {
		this.name = name;
		this.attributeAccessor = attributeAccessor;
	}
}

export class Geometry implements IVersionable, IDisposable {
	disposed: boolean = false;
	version: number = 0;
	indices: AttributeAccessor | null = null;
	namedAttributeAccessors: NamedAttributeAccessor[] = [];

	constructor() {}

	dirty() {
		this.version++;
	}

	dispose() {
		if( ! this.disposed ) {
			// reaching deep to dispose of all attribute views, but technically they may be reused with other geometries.
			this.namedAttributeAccessors.forEach( namedAttributeAccessor => {
				namedAttributeAccessor.attributeAccessor.attributeView.dispose();
			})
			this.disposed = true;
			this.dirty();
		}
	}

	setIndices(indices: AttributeAccessor) {
		this.indices = indices;
	}

	setAttribute(name: string, attributeAccessor: AttributeAccessor) {
		// TODO: Figure out how to do this more efficiently and less verbosely.
		let namedAttributeAccessor = this.namedAttributeAccessors.find(
			(item) => item.name === name,
		);
		if (namedAttributeAccessor) {
			namedAttributeAccessor.attributeAccessor = attributeAccessor;
		} else {
			this.namedAttributeAccessors.push(
				new NamedAttributeAccessor(name, attributeAccessor),
			);
		}
	}

	findAttribute(name: string): AttributeAccessor | null {
		let namedAttributeAccessor = this.namedAttributeAccessors.find(
			(item) => item.name === name,
		);
		return namedAttributeAccessor
			? namedAttributeAccessor.attributeAccessor
			: null;
	}
}
