//
// based on Camera from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from "../../math/Matrix4";
import { Group } from "../Group";

export abstract class Camera extends Group {
  pixelAspectRatio = 1.0;

  abstract getProjection(viewAspectRatio: number): Matrix4;
}
