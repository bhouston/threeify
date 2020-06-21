import { Euler } from "../../math/Euler";
import { makeEulerFromRotationMatrix4 } from "../../math/Euler.Functions";
import { Matrix4 } from "../../math/Matrix4";
import { makeMatrix4RotationFromEuler } from "../../math/Matrix4.Functions";
import { Vector3 } from "../../math/Vector3";

export function negativeZDirectionToEuler(d: Vector3): Euler {
  // NOTE: This has never been tested.  It may not work.
  // found on stackoverflow.
  console.warn("This has never been tested.");

  /* Find cosφ and sinφ */
  const c1 = d.length();
  const s1 = d.z;
  /* Find cosθ and sinθ; if gimbal lock, choose (1,0) arbitrarily */
  const c2 = c1 !== 0 ? d.x / c1 : 1.0;
  const s2 = c1 !== 0 ? d.y / c1 : 0.0;

  const m = new Matrix4();
  const te = m.elements;
  te[0] = s1 * c2;
  te[4] = s1 * s2;
  te[8] = -c1;
  te[12] = 0;

  te[1] = s2;
  te[5] = -c2;
  te[9] = 0;
  te[13] = 0;

  te[2] = -d.x;
  te[6] = -d.y;
  te[10] = -d.z;
  te[14] = 0;

  te[3] = 0;
  te[7] = 0;
  te[11] = 0;
  te[15] = 1;

  return makeEulerFromRotationMatrix4(new Euler(), m);
}

export function eulerToNegativeZDirection(e: Euler): Vector3 {
  console.warn("This has never been tested.");
  const m = makeMatrix4RotationFromEuler(new Matrix4(), e);
  const te = m.elements;
  return new Vector3(te[2], te[6], te[10]);
}
