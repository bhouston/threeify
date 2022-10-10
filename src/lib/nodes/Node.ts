//
// basic node
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { IDisposable, IIdentifiable, IVersionable } from '../core/types.js';
import { Euler3 } from '../math/Euler3.js';
import {
  composeMatrix4,
  makeMatrix4Inverse
} from '../math/Matrix4.Functions.js';
import { Matrix4 } from '../math/Matrix4.js';
import { makeQuaternionFromEuler } from '../math/Quaternion.Functions.js';
import { Vector3 } from '../math/Vector3.js';
import { NodeCollection } from './NodeCollection.js';

export class Node implements IIdentifiable, IVersionable, IDisposable {
  disposed = false;
  readonly uuid: string = generateUUID();
  version = 0;
  parent: Node | undefined = undefined;
  name = '';
  children: NodeCollection;
  position: Vector3 = new Vector3();
  rotation: Euler3 = new Euler3();
  scale: Vector3 = new Vector3(1, 1, 1);
  visible = true;

  #parentToLocalVersion = -1;
  #parentToLocal: Matrix4 = new Matrix4();
  #localToParentVersion = -1;
  #localToParent: Matrix4 = new Matrix4();
  // TODO: implement this one this.parent works!
  #localToWorldTransform: Matrix4 = new Matrix4();
  // TODO: implement this one this.parent works!
  #worldToLocalTransform: Matrix4 = new Matrix4();

  constructor() {
    this.children = new NodeCollection(this);
  }

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.dirty();
    }
  }

  get localToParentTransform(): Matrix4 {
    if (this.#parentToLocalVersion !== this.version) {
      this.#localToParent = composeMatrix4(
        this.position,
        makeQuaternionFromEuler(this.rotation),
        this.scale,
        this.#localToParent
      );
      this.#parentToLocalVersion = this.version;
    }
    return this.#localToParent;
  }

  get parentToLocalTransform(): Matrix4 {
    if (this.#localToParentVersion !== this.version) {
      makeMatrix4Inverse(this.localToParentTransform, this.#parentToLocal);
      this.#localToParentVersion = this.version;
    }
    return this.#localToParent;
  }
}

// visitors

export function depthFirstVisitor(
  node: Node,
  callback: (node: Node) => void
): void {
  node.children.forEach((child) => {
    depthFirstVisitor(child, callback);
  });
  callback(node);
}

export function rootLastVisitor(
  node: Node,
  callback: (node: Node) => void
): void {
  callback(node);
  if (node.parent !== undefined) {
    rootLastVisitor(node.parent, callback);
  }
}

export function rootFirstVisitor(
  node: Node,
  callback: (node: Node) => void
): void {
  if (node.parent !== undefined) {
    rootFirstVisitor(node.parent, callback);
  }
  callback(node);
}
