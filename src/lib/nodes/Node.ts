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
} from '../interfaces/Standard.js';
import { Euler } from '../math/Euler.js';
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
	rotation: Euler = new Euler();
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

	copy(source: Node) {
		this.name = source.name;
		this.position.copy(source.position);
		this.rotation.copy(source.rotation);
		this.scale.copy(source.scale);

		// NOTE: explicitly not copying children!

		return this;
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
