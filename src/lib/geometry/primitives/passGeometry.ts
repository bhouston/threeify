//
// based on PlaneGeometry from Three.js
//
// Authors:
// * @bhouston
//

import { Vector2 } from "../../math/Vector2";
import { makeFloat32Attribute, makeUint32Attribute } from "../Attribute";
import { Geometry } from "../Geometry";

/**
 * A 2D pass geometry
 *
 * @param min homogeneous coordinate minimum
 * @param max homogeneous coordinate minimum
 */
export function passGeometry(min = new Vector2(-1, -1), max = new Vector2(1, 1)): Geometry {
  const geometry = new Geometry();
  geometry.indices = makeUint32Attribute([0, 1, 2, 0, 2, 3]);
  geometry.attributes["position"] = makeFloat32Attribute([min.x, min.y, min.x, max.y, max.x, max.y, max.x, min.y], 2);
  geometry.attributes["uv"] = makeFloat32Attribute([0, 0, 0, 1, 1, 1, 1, 0], 2);
  geometry.attributes["normal"] = makeFloat32Attribute([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], 3);

  return geometry;
}
