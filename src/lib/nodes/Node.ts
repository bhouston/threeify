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
  composeMat4,
  mat4Inverse
} from '../math/Mat4.Functions.js';
import { Mat4 } from '../math/Mat4.js';
import { euler3ToQuat } from '../math/Quat.Functions.js';
import { Vec3 } from '../math/Vec3.js';
import { NodeCollection } from './NodeCollection.js';

export class Node implements IIdentifiable, IDisposable {
  disposed = false;
  readonly uuid: string = generateUUID();
  version = 0;
  parent: Node | undefined = undefined;
  name = '';
  children: NodeCollection;
  position: Vec3 = new Vec3();
  rotation: Euler3 = new Euler3();
  scale: Vec3 = new Vec3(1, 1, 1);
  visible = true;

  constructor() {
    this.children = new NodeCollection(this);
  }

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
    }
  }

  get localToParentTransform(): Mat4 {
    return composeMat4(
      this.position,
      euler3ToQuat(this.rotation),
      this.scale
    );
  }

  get parentToLocalTransform(): Mat4 {
    return mat4Inverse(this.localToParentTransform);
  }
}
