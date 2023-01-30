import { Mat4, Vec3 } from '@threeify/vector-math';

export class CameraUniforms {
  public worldToView = new Mat4();
  public viewToScreen = new Mat4();
  public cameraPosition = new Vec3();
  public cameraNear = 0;
  public cameraFar = 0;
}
