//
// basic node
//
// Authors:
// * @bhouston
//

import { Geometry } from '../core/Geometry.js';
import { Node } from '../nodes/Node.js';

export class Mesh extends Node {
	geometry: Geometry;

	constructor(geometry: Geometry) {
		super();

		this.geometry = geometry;
	}
}
