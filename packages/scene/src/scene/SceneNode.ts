import { Vec3, Quat, IIdentifiable, IVersionable, Mat4, generateUUID } from "@threeify/core";

export interface ISceneNode {
  id?: string;
  name?: string;
  position?: Vec3;
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
  public position = new Vec3(0, 0, 0);
  public rotation = new Quat(0, 0, 0, 1);
  public scale = new Vec3(1, 1, 1);
  public visible = true;

  public localToParentMatrix = new Mat4();
  public parentToLocalMatrix = new Mat4();
  public localToWorldMatrix = new Mat4();
  public worldToLocalMatrix = new Mat4();

  constructor(props: ISceneNode = {}) {
    this.id = props.id || generateUUID();
    this.name = props.name || this.name;
    if (props.position !== undefined) this.position.copy(props.position);
    if (props.rotation !== undefined) this.rotation.copy(props.rotation);
    if (props.scale !== undefined) this.scale.copy(props.scale);
    this.visible = props.visible || this.visible;
  }

  dirty(): void {
    this.version++;
  }
}