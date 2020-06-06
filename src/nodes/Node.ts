//
// basic node
//
// Authors:
// * @bhouston
//

import { IDisposable, IIdentifiable, IVersionable } from "../model/interfaces";
import { Euler3 } from "../math/Euler3";
import { Matrix4 } from "../math/Matrix4";
import { NodeCollection } from "./NodeCollection";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { generateUUID } from "../model/generateUuid";

export class Node implements IIdentifiable, IVersionable, IDisposable {
  disposed = false;
  readonly uuid: string = generateUUID();
  version = 0;
  parent: Node | null = null;
  name = "";
  readonly children: NodeCollection = new NodeCollection(this);
  position: Vector3 = new Vector3();
  rotation: Euler3 = new Euler3();
  scale: Vector3 = new Vector3(1, 1, 1);

  private _parentToLocalVersion = -1;
  private _parentToLocal: Matrix4 = new Matrix4();

  private _localToParentVersion = -1;
  private _localToParent: Matrix4 = new Matrix4();

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
    if (this._parentToLocalVersion !== this.version) {
      this._localToParent.compose(
        this.position,
        new Quaternion().setFromEuler(this.rotation),
        this.scale,
      );
      this._parentToLocalVersion = this.version;
    }
    return this._localToParent;
  }
  get parentToLocalTransform(): Matrix4 {
    if (this._localToParentVersion !== this.version) {
      this._parentToLocal.copy(this.localToParentTransform).invert();
      this._localToParentVersion = this.version;
    }
    return this._localToParent;
  }

  // private _localToWorldTransform: Matrix4 = new Matrix4();	// TODO: implement this one this.parent works!
  // private _worldToLocalTransform: Matrix4 = new Matrix4();	// TODO: implement this one this.parent works!
}

// visitors

export function depthFirstVisitor(node: Node, callback: (node: Node) => void): void {
  node.children.forEach((child) => {
    depthFirstVisitor(child, callback);
  });
  callback(node);
}

export function rootLastVisitor(node: Node, callback: (node: Node) => void): void {
  callback(node);
  if (node.parent) {
    rootLastVisitor(node.parent, callback);
  }
}

export function rootFirstVisitor(node: Node, callback: (node: Node) => void): void {
  if (node.parent) {
    rootFirstVisitor(node.parent, callback);
  }
  callback(node);
}
