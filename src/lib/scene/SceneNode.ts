//
// basic node
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { composeMat4, mat4Multiply } from '../math/Mat4.Functions.js';
import { Mat4 } from '../math/Mat4.js';
import { Quat } from '../math/Quat.js';
import { Vec3 } from '../math/Vec3.js';

export interface ISceneNode {
  id?: string;
  name?: string;
  position?: Vec3;
  rotation?: Quat;
  scale?: Vec3;
  visible?: boolean;
}

export class SceneNode {
  public id;
  public name = '';
  public parent: SceneNode | undefined = undefined;
  public readonly children: SceneNode[] = [];
  public readonly position: Vec3 = new Vec3(0, 0, 0);
  public readonly rotation: Quat = new Quat(0, 0, 0, 1);
  public readonly scale: Vec3 = new Vec3(1, 1, 1);
  public visible = true;

  constructor(props: ISceneNode = {}) {
    this.id = props.id || generateUUID();
    this.name = props.name || this.name;
    if (props.position !== undefined) this.position.copy(props.position);
    if (props.rotation !== undefined) this.rotation.copy(props.rotation);
    if (props.scale !== undefined) this.scale.copy(props.scale);
    this.visible = props.visible || this.visible;
  }

  get localToParent(): Mat4 {
    return composeMat4(this.position, this.rotation, this.scale);
  }
  get localToWorld(): Mat4 {
    const result = this.localToParent;
    if (this.parent !== undefined) {
      mat4Multiply(result, this.parent.localToWorld);
    }
    return result;
  }
}
