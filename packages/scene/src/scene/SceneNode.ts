import { generateUUID, IIdentifiable, IVersionable } from '@threeify/core';
import { Box3, Mat4, Quat, Vec3 } from '@threeify/math';

export interface ISceneNodeProps {
  id?: string;
  name?: string;
  translation?: Vec3;
  rotation?: Quat;
  scale?: Vec3;
  visible?: boolean;
}

export class SceneNode implements IIdentifiable, IVersionable {
  public readonly id;
  public version = 0;
  public name = '';
  public parent: SceneNode | undefined = undefined;
  public readonly children: SceneNode[] = [];
  public translation = Vec3.Zero;
  public rotation = new Quat(0, 0, 0, 1);
  public scale = new Vec3(1, 1, 1);
  public visible = true;

  // derived
  public localToParent = new Mat4();
  public parentToLocal = new Mat4();
  public localToWorld = new Mat4();
  public worldToLocal = new Mat4();
  public nodeBoundingBox = new Box3();
  public subTreeBoundingBox = new Box3();

  constructor(props: ISceneNodeProps = {}) {
    this.id = props.id || generateUUID();
    this.name = props.name || this.name;
    if (props.translation !== undefined)
      this.translation.copy(props.translation);
    if (props.rotation !== undefined) this.rotation.copy(props.rotation);
    if (props.scale !== undefined) this.scale.copy(props.scale);
    this.visible = props.visible || this.visible;
  }

  dirty(): void {
    this.version++;
  }
}
