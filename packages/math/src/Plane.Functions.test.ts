import {
  coplanarPointsToPlane,
  normalAndCoplanarPointToPlane
} from './Plane.Functions.js';
import { vec3Delta, vec3Normalize } from './Vec3.Functions.js';
import { Vec3 } from './Vec3.js';

describe('Plane Functions', () => {
  test('setFromNormalAndCoplanarPoint', () => {
    const normal = vec3Normalize(new Vec3(1, 1, 1));
    const a = normalAndCoplanarPointToPlane(normal, new Vec3());

    expect(vec3Delta(a.normal, normal)).toBeCloseTo(0);
    expect(a.constant).toBeCloseTo(0);
  });

  test('setFromCoplanarPoints', () => {
    const v1 = new Vec3(2, 0.5, 0.25);
    const v2 = new Vec3(2, -0.5, 1.25);
    const v3 = new Vec3(2, -3.5, 2.2);
    const normal = new Vec3(1, 0, 0);
    const constant = -2;

    const a = coplanarPointsToPlane(v1, v2, v3);

    expect(vec3Delta(a.normal, normal)).toBeCloseTo(0);
    expect(a.constant).toBeCloseTo(constant);
  });
});
