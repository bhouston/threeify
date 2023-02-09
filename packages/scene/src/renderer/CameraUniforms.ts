import { Mat4 } from '@threeify/math';

export class CameraUniforms {
  public worldToView = new Mat4();
  public viewToScreen = new Mat4();
}
