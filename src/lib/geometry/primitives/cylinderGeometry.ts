//
// based on CircleBufferGeometry from Three.js
//
// Authors:
// * @bhouston
//

import { Vec2 } from '../../math/Vec2.js';
import { Vec3 } from '../../math/Vec3.js';
import { makeFloat32Attribute, makeUint32Attribute } from '../Attribute.js';
import { Geometry } from '../Geometry.js';

export function cylinderGeometry(
  radius = 0.5,
  height = 1,
  segments = 8,
  thetaStart = 0,
  thetaLength = Math.PI * 2
): Geometry {
  const indicesTop: number[] = [];
  const verticesTop: number[] = [];
  const normalsTop: number[] = [];
  const uvsTop: number[] = [];

  const indicesBottom: number[] = [];
  const verticesBottom: number[] = [];
  const normalsBottom: number[] = [];
  const uvsBottom: number[] = [];

  const indicesSide: number[] = [];
  const verticesSide: number[] = [];
  const normalsSide: number[] = [];
  const uvsSide: number[] = [];

  // helper variables

  const vertex = new Vec3();
  const uv = new Vec2();

  // center point

  verticesTop.push(0, 0, height * 0.5);
  normalsTop.push(0, 0, 1);
  uvsTop.push(0.5, 0.5);

  verticesBottom.push(0, 0, -height * 0.5);
  normalsBottom.push(0, 0, -1);
  uvsBottom.push(0.5, 0.5);

  for (let s = 0, i = 3; s <= segments; s++, i += 3) {
    const segment = thetaStart + (s / segments) * thetaLength;

    // vertex

    vertex.x = radius * Math.cos(segment);
    vertex.y = radius * Math.sin(segment);

    verticesTop.push(vertex.x, vertex.y, vertex.z + height * 0.5);
    verticesBottom.push(vertex.x, vertex.y, vertex.z - height * 0.5);

    verticesSide.push(
      vertex.x,
      vertex.y,
      vertex.z + height * 0.5,
      vertex.x,
      vertex.y,
      vertex.z - height * 0.5
    );

    // normal

    normalsTop.push(0, 0, 1);
    normalsBottom.push(0, 0, -1);

    normalsSide.push(
      Math.cos(segment),
      Math.sin(segment),
      0,
      Math.cos(segment),
      Math.sin(segment),
      0
    );

    // uvs

    uv.x = (verticesTop[i] / radius + 1) / 2;
    uv.y = (verticesTop[i + 1] / radius + 1) / 2;

    uvsTop.push(uv.x, uv.y);
    uvsBottom.push(1 - uv.x, 1 - uv.y);

    uvsSide.push(s / segments, 0, s / segments, 1);
  }

  // indices
  const bo = verticesTop.length / 3;
  const so = (verticesTop.length / 3) * 2;
  for (let i = 1; i <= segments; i++) {
    indicesTop.push(i, i + 1, 0);
    indicesBottom.push(bo + i + 1, bo + i, bo + 0);
  }
  for (let i = 0; i < segments; i++) {
    const io = i * 2;
    indicesSide.push(
      so + io,
      so + io + 1,
      so + io + 3,
      so + io,
      so + io + 3,
      so + io + 2
    );
  }

  indicesTop.push(indicesTop.at(-1) ?? 0, 1, 0);
  indicesBottom.push(bo + 1, indicesBottom.at(-1) ?? 0, bo + 0);

  // build geometry

  const geometry = new Geometry();
  geometry.indices = makeUint32Attribute(
    indicesTop.concat(indicesBottom).concat(indicesSide)
  );
  geometry.attributes.position = makeFloat32Attribute(
    verticesTop.concat(verticesBottom).concat(verticesSide),
    3
  );
  geometry.attributes.normal = makeFloat32Attribute(
    normalsTop.concat(normalsBottom).concat(normalsSide),
    3
  );
  geometry.attributes.uv = makeFloat32Attribute(
    uvsTop.concat(uvsBottom).concat(uvsSide),
    2
  );

  return geometry;
}
