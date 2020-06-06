//
// basic node
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../model/generateUuid.js';
import {
	IDisposable,
	IIdentifiable,
	IVersionable,
	ICloneable,
} from '../model/interfaces.js';
import { Euler3 } from '../math/Euler3.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Quaternion } from '../math/Quaternion.js';
import { Vector3 } from '../math/Vector3.js';
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

	private _parentToLocalVersion = -1;
	private _parentToLocal: Matrix4 = new Matrix4();
	get localToParentTransform() {
		if( this._parentToLocalVersion !== this.version ) {
			this._localToParent.compose(
				this.position,
				new Quaternion().setFromEuler(this.rotation),
				this.scale,
			);
			this._parentToLocalVersion = this.version;
		}
		return this._localToParent;
	}

	private _localToParentVersion = -1;
	private _localToParent: Matrix4 = new Matrix4();
	get parentToLocalTransform() {
		if( this._localToParentVersion !== this.version ) {
			this._parentToLocal.copy(this.localToParentTransform).invert();		
			this._localToParentVersion = this.version;
		}
		return this._localToParent;
	}

	//private _localToWorldTransform: Matrix4 = new Matrix4();	// TODO: implement this one this.parent works!
	//private _worldToLocalTransform: Matrix4 = new Matrix4();	// TODO: implement this one this.parent works!

}

// visitors

export function depthFirstVisitor(node: Node, callback: (node: Node) => void) {
	node.children.forEach((child) => {
		depthFirstVisitor(child, callback);
	});
	callback(node);
}

export function rootLastVisitor(node: Node, callback: (node: Node) => void) {
	callback(node);
	if (node.parent) rootLastVisitor(node.parent, callback);
}

export function rootFirstVisitor(node: Node, callback: (node: Node) => void) {
	if (node.parent) rootFirstVisitor(node.parent, callback);
	callback(node);
}
