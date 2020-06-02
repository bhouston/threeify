//
// basic node
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../generateUuid.js';
import { IDisposable, IIdentifiable, IVersionable } from '../interfaces/Standard.js';
import { Euler } from '../math/Euler.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Quaternion } from '../math/Quaternion.js';
import { Vector3 } from '../math/Vector3.js';

export class Node implements IIdentifiable, IVersionable, IDisposable {
	disposed: boolean = false;
	uuid: string = generateUUID();
	version: number = 0;
	name: string = '';
	position: Vector3 = new Vector3(0, 0, 0);
	rotation: Euler = new Euler();
	scale: Vector3 = new Vector3(0, 0, 0);
	children: Array<Node> = [];

	constructor() {}

	dirty() {
		this.version++;
	}

	dispose() {
		if( ! this.disposed ) {
			this.disposed = true;
			this.dirty();
		}
	}

	copy(source: Node) {
		this.name = source.name;
		this.position.copy(source.position);
		this.rotation.copy(source.rotation);
		this.scale.copy(source.scale);

		// NOTE: explicitly not copying children!

		return this;
	}

	toLocalToWorldMatrix() {
		return new Matrix4().compose(
			this.position,
			new Quaternion().setFromEuler(this.rotation),
			this.scale,
		);
	}
}

function depthFirstVisitor(node: Node, callback: (node: Node) => void) {
	node.children.forEach((child) => {
		depthFirstVisitor(child, callback);
	});

	callback(node);
}
