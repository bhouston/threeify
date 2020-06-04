//
// basic node
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../generateUuid.js';
import {
	IDisposable,
	IIdentifiable,
	IVersionable,
	ICloneable,
} from '../interfaces/Standard.js';
import { Euler3 } from '../math/Euler3.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Quaternion } from '../math/Quaternion.js';
import { Vector3 } from '../math/Vector3.js';
import { VersionedValue } from '../VersionedValue.js';

export class Node implements IIdentifiable, IVersionable, IDisposable {
	disposed: boolean = false;
	readonly uuid: string = generateUUID();
	version: number = 0;
	name: string = '';
	position: Vector3 = new Vector3(0, 0, 0);
	rotation: Euler3 = new Euler3();
	scale: Vector3 = new Vector3(0, 0, 0);
	readonly children: Array<Node> = [];

	constructor() {}

	dirty() {
		this.version++;
	}

	dispose() {
		if (!this.disposed) {
			this.disposed = true;
			this.dirty();
		}
	}

	private versionedLocalToWorldMatrix: VersionedValue<
		Matrix4
	> = new VersionedValue<Matrix4>(new Matrix4());
	get localToWorldMatrix() {
		if (this.versionedLocalToWorldMatrix.version < this.version) {
			this.versionedLocalToWorldMatrix.value.compose(
				this.position,
				new Quaternion().setFromEuler(this.rotation),
				this.scale,
			);
			this.versionedLocalToWorldMatrix.version = this.version;
		}
		return this.versionedLocalToWorldMatrix.value;
	}

	private versionedWorldToLocalMatrix: VersionedValue<
		Matrix4
	> = new VersionedValue<Matrix4>(new Matrix4());
	get worldToLocalMatrix() {
		if (this.versionedWorldToLocalMatrix.version < this.version) {
			this.versionedWorldToLocalMatrix.value
				.copy(this.localToWorldMatrix)
				.invert();
			this.versionedWorldToLocalMatrix.version = this.version;
		}
		return this.versionedWorldToLocalMatrix.value;
	}
}

export function depthFirstVisitor(node: Node, callback: (node: Node) => void) {
	node.children.forEach((child) => {
		depthFirstVisitor(child, callback);
	});

	callback(node);
}
