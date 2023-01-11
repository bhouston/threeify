import { Mat3 } from './Mat3';
import { basis3ToMat3, mat3Delta, mat3TransformPoint3 } from './Mat3.Functions';
import { Mat4 } from './Mat4';
import { mat3ToMat4, mat4ToBasis3 } from './Mat4.Functions';
import { Vec3 } from './Vec3';
import { vec3Delta } from './Vec3.Functions';

describe('Mat3 Functions', () => {
  test('mat3ToMat4', () => {
    const a = new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = mat3ToMat4(a);
    expect(b.elements[0]).toBe(1);
    expect(b.elements[1]).toBe(2);
    expect(b.elements[2]).toBe(3);
    expect(b.elements[3]).toBe(0);
    expect(b.elements[4]).toBe(4);
    expect(b.elements[5]).toBe(5);
    expect(b.elements[6]).toBe(6);
    expect(b.elements[7]).toBe(0);
    expect(b.elements[8]).toBe(7);
    expect(b.elements[9]).toBe(8);
    expect(b.elements[10]).toBe(9);
    expect(b.elements[11]).toBe(0);
    expect(b.elements[12]).toBe(0);
    expect(b.elements[13]).toBe(0);
    expect(b.elements[14]).toBe(0);
    expect(b.elements[15]).toBe(1);
  });

  test('basis3ToMat3/mat3ToBasis3', () => {
    const identityBasis = [
      new Vec3(1, 0, 0),
      new Vec3(0, 1, 0),
      new Vec3(0, 0, 1)
    ];
    const a = basis3ToMat3(
      identityBasis[0],
      identityBasis[1],
      identityBasis[2]
    );
    const identity = new Mat4();
    expect(mat3Delta(a, identity)).toBe(0);

    const testBases = [
      new Vec3(0, 1, 0),
      new Vec3(-1, 0, 0),
      new Vec3(0, 0, 1)
    ];

    const b = basis3ToMat3(testBases[0], testBases[1], testBases[2]);
    const outBasis = [new Vec3(), new Vec3(), new Vec3()];

    mat4ToBasis3(b, outBasis[0], outBasis[1], outBasis[2]);
    // check what goes in, is what comes out.
    for (let j = 0; j < outBasis.length; j++) {
      console.log(j, testBases[j], outBasis[j], b);
      expect(vec3Delta(testBases[j], outBasis[j])).toBe(0);
    }

    // get the basis out the hard war
    for (let j = 0; j < identityBasis.length; j++) {
      outBasis[j].copy(identityBasis[j]);
      mat3TransformPoint3(b, outBasis[j], outBasis[j]);
    }

    // did the multiply method of basis extraction work?
    for (let j = 0; j < outBasis.length; j++) {
      expect(vec3Delta(testBases[j], outBasis[j])).toBe(0);
    }
  });
});
