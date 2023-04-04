import { Plane } from './Plane';
import {
  coplanarPointsToPlane,
  normalAndCoplanarPointToPlane,
  planePointDistance,
  planeProjectPointOnPlane
} from './Plane.Functions';
import { Vec3 } from './Vec3';
import { vec3Delta, vec3Normalize } from './Vec3.Functions';

describe('Plane Functions', () => {
  test('planePointDistance', () => {
    const planeAtOrigin = new Plane(new Vec3(0, 0, 1), 0);
    const planeAtZ1 = new Plane(new Vec3(0, 0, 1), 1);

    expect(planePointDistance(planeAtOrigin, new Vec3(0, 0, 0))).toBeCloseTo(0);
    expect(planePointDistance(planeAtOrigin, new Vec3(10, 10, 0))).toBeCloseTo(
      0
    );

    expect(planePointDistance(planeAtZ1, new Vec3(0, 0, 0))).toBeCloseTo(-1);
    expect(planePointDistance(planeAtZ1, new Vec3(10, 10, 0))).toBeCloseTo(-1);

    expect(planePointDistance(planeAtZ1, new Vec3(0, 0, 2))).toBeCloseTo(1);
    expect(planePointDistance(planeAtZ1, new Vec3(-10, -10, 2))).toBeCloseTo(1);
  });

  test('planeProjectPointOnPlane', () => {
    const planeAtOrigin = new Plane(new Vec3(0, 0, 1), 0);
    const planeAtZ1 = new Plane(new Vec3(0, 0, 1), 1);

    expect(
      planePointDistance(
        planeAtOrigin,
        planeProjectPointOnPlane(planeAtOrigin, new Vec3(0, 0, 0))
      )
    ).toBeCloseTo(0);
    expect(
      planePointDistance(
        planeAtOrigin,
        planeProjectPointOnPlane(planeAtOrigin, new Vec3(10, 10, 0))
      )
    ).toBeCloseTo(0);

    expect(
      planePointDistance(
        planeAtZ1,
        planeProjectPointOnPlane(planeAtZ1, new Vec3(0, 0, 0))
      )
    ).toBeCloseTo(0);
    expect(
      planePointDistance(
        planeAtZ1,
        planeProjectPointOnPlane(planeAtZ1, new Vec3(10, 10, 0))
      )
    ).toBeCloseTo(0);
  });

  test('setFromNormalAndCoplanarPoint', () => {
    const normal = vec3Normalize(new Vec3(1, 1, 1));
    const a = normalAndCoplanarPointToPlane(normal, new Vec3());

    expect(vec3Delta(a.normal, normal)).toBeCloseTo(0);
    expect(a.distance).toBeCloseTo(0);
  });

  test('setFromCoplanarPoints', () => {
    const v1 = new Vec3(2, 0.5, 0.25);
    const v2 = new Vec3(2, -0.5, 1.25);
    const v3 = new Vec3(2, -3.5, 2.2);
    const normal = new Vec3(1, 0, 0);
    const constant = 2;

    const a = coplanarPointsToPlane(v1, v2, v3);

    expect(vec3Delta(a.normal, normal)).toBeCloseTo(0);
    expect(a.distance).toBeCloseTo(constant);
  });
});
