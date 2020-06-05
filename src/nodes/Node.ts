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
import { NodeCollection } from './NodeCollection.js';

export class Node implements IIdentifiable, IVersionable, IDisposable {
	disposed: boolean = false;
	readonly uuid: string = generateUUID();
	version: number = 0;
	parent: Node | null = null;
	name: string = '';
	readonly children: NodeCollection = new NodeCollection(this);
	position: Vector3 = new Vector3();
	rotation: Euler3 = new Euler3();
	scale: Vector3 = new Vector3(1, 1, 1);

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

	private _derivedVersion = -1;
	private _parentToLocalTransform: Matrix4 = new Matrix4();
	private _localToParentTransform: Matrix4 = new Matrix4();
	//private _localToWorldTransform: Matrix4 = new Matrix4();	// TODO: implement this one this.parent works!
	//private _worldToLocalTransform: Matrix4 = new Matrix4();	// TODO: implement this one this.parent works!

	private refresh() {
		if (this._derivedVersion !== this.version) {
			this._localToParentTransform.compose(
				this.position,
				new Quaternion().setFromEuler(this.rotation),
				this.scale,
			);
			this._parentToLocalTransform.copy(this._localToParentTransform).invert();
			this._derivedVersion = this.version;
		}
	}

	get localToParentTransform() {
		this.refresh();
		return this._localToParentTransform;
	}
	get parentToLocalTransform() {
		this.refresh();
		return this._parentToLocalTransform;
	}
}

export function depthFirstVisitor(node: Node, callback: (node: Node) => void) {
	node.children.forEach((child) => {
		depthFirstVisitor(child, callback);
	});
	callback(node);
}

export function rootVisitor(node: Node, callback: (node: Node) => void) {
	throw new Error('not implemented'); // TODO: remove this once Node.parent works!
	//callback(node);
	//if (node.parent) rootVisitor(node.parent, callback);
}
