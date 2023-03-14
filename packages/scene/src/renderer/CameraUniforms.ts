import { Mat4 } from '@threeify/math';

export class CameraUniforms {
  public worldToView = new Mat4();
  public viewToWorld = new Mat4();
  public viewToClip = new Mat4();
}
