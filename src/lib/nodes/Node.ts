//
// basic node
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { IDisposable, IIdentifiable } from '../core/types.js';
import { Euler3 } from '../math/Euler3.js';
import {
  composeMatrix4,
  makeMatrix4Inverse
} from '../math/Matrix4.Functions.js';
import { Matrix4 } from '../math/Matrix4.js';
import { makeQuaternionFromEuler } from '../math/Quaternion.Functions.js';
import { Vector3 } from '../math/Vector3.js';
import { NodeCollection } from './NodeCollection.js';

export class Node implements IIdentifiable, IDisposable {
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

  constructor() {
    this.children = new NodeCollection(this);
  }

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
    }
  }

  get localToParentTransform(): Matrix4 {
    return composeMatrix4(
      this.position,
      makeQuaternionFromEuler(this.rotation),
      this.scale
    );
  }

  get parentToLocalTransform(): Matrix4 {
    return makeMatrix4Inverse(this.localToParentTransform);
  }
}
