import { mat4ToEuler3 } from '../../math/Euler3.Functions.js';
import { Euler3, EulerOrder3 } from '../../math/Euler3.js';
import { euler3ToMat4 } from '../../math/Mat4.Functions.js';
import { Mat4 } from '../../math/Mat4.js';
import { vec3Length } from '../../math/Vec3.Functions.js';
import { Vec3 } from '../../math/Vec3.js';

export function negativeZDirectionToEuler(
  d: Vec3,
  result = new Euler3()
): Euler3 {
  // NOTE: This has never been tested.  It may not work.
  // found on stackoverflow.
  console.warn('This has never been tested.');

  /* Find cosφ and sinφ */
  const c1 = vec3Length(d);
  const s1 = d.z;
  /* Find cosθ and sinθ; if gimbal lock, choose (1,0) arbitrarily */
  const c2 = c1 !== 0 ? d.x / c1 : 1;
  const s2 = c1 !== 0 ? d.y / c1 : 0;

  const m = new Mat4();
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

  return mat4ToEuler3(m, EulerOrder3.Default, result);
}

export function eulerToNegativeZDirection(
  e: Euler3,
  result = new Vec3()
): Vec3 {
  console.warn('This has never been tested.');
  const m = euler3ToMat4(e);
  const te = m.elements;
  return result.set(te[2], te[6], te[10]);
}
