import { Mat4 } from '../../math/Mat4';
import { Vec3 } from '../../math/Vec3';

export class SceneUniforms {
  public worldToView = new Mat4();
  public viewToScreen = new Mat4();
  public cameraPosition = new Vec3();
  public cameraNear = 0;
  public cameraFar = 0;
}
