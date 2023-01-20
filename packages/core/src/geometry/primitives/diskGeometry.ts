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

export function diskGeometry(
  radius = 0.5,
  segments = 8,
  thetaStart = 0,
  thetaLength = Math.PI * 2
): Geometry {
  const indices: number[] = [];
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  // helper variables

  const vertex = new Vec3();
  const uv = new Vec2();

  // center point

  vertices.push(0, 0, 0);
  normals.push(0, 0, 1);
  uvs.push(0.5, 0.5);

  for (let s = 0, i = 3; s <= segments; s++, i += 3) {
    const segment = thetaStart + (s / segments) * thetaLength;

    // vertex

    vertex.x = radius * Math.cos(segment);
    vertex.y = radius * Math.sin(segment);

    vertices.push(vertex.x, vertex.y, vertex.z);

    // normal

    normals.push(0, 0, 1);

    // uvs

    uv.x = (vertices[i] / radius + 1) / 2;
    uv.y = (vertices[i + 1] / radius + 1) / 2;

    uvs.push(uv.x, uv.y);
  }

  // indices

  for (let i = 1; i <= segments; i++) {
    indices.push(i, i + 1, 0);
  }
  indices.push(indices.at(-1) ?? 0, 1, 0);

  // build geometry

  const geometry = new Geometry();
  geometry.indices = makeUint32Attribute(indices);
  geometry.attributes.position = makeFloat32Attribute(vertices, 3);
  geometry.attributes.normal = makeFloat32Attribute(normals, 3);
  geometry.attributes.uv0 = makeFloat32Attribute(uvs, 2);

  return geometry;
}
