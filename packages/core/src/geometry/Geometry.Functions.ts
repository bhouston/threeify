import {
  Box3,
  box3Center,
  box3Empty,
  box3ExpandByPoint3,
  box3Size,
  makeVec3View,
  Mat4,
  mat4Multiply,
  mat4TransformNormal3,
  mat4TransformVec3,
  PrimitiveView,
  scale3ToMat4,
  Sphere,
  sphereToBox3,
  translation3ToMat4,
  Vec3,
  vec3Add,
  vec3Cross,
  vec3DistanceSq,
  vec3MaxComponent,
  vec3MultiplyByScalar,
  vec3Negate,
  vec3Normalize,
  vec3Reciprocal,
  vec3Subtract
} from '@threeify/math';

import { Attribute, makeFloat32Attribute } from './Attribute.js';
import { AttributeData } from './AttributeData.js';
import { Geometry } from './Geometry.js';

export function outputDebugInfo(geometry: Geometry): void {
  console.log('geometry.name', geometry.name);
  if (geometry.indices !== undefined) {
    console.log('geometry.indices.count', geometry.indices.count);
  }
  for (const name in geometry.attributes) {
    const attribute = geometry.attributes[name];
    if (attribute !== undefined) {
      console.log(
        `attribute ${name}: count ${attribute.count} bytesPerVertex ${attribute.bytesPerVertex}`
      );
    }
  }
}

function copyBytesUsingStride(
  dest: ArrayBuffer,
  source: ArrayBuffer,
  bytesPerVertex: number,
  byteStridePerVertex: number,
  attributeOffset: number
): void {
  const destBytes = new Int8Array(dest);
  const sourceBytes = new Int8Array(source);
  const vertexCount = source.byteLength / bytesPerVertex;
  for (let v = 0; v < vertexCount; v++) {
    const sourceOffset = v * bytesPerVertex;
    const destOffset = v * byteStridePerVertex + attributeOffset;
    for (let i = 0; i < bytesPerVertex; i++) {
      destBytes[destOffset + i] = sourceBytes[sourceOffset + i];
    }
  }
}

export function convertToInterleavedGeometry(geometry: Geometry): Geometry {
  let byteStridePerVertex = 0;
  let vertexCount = 0;
  for (const name in geometry.attributes) {
    const attribute = geometry.attributes[name];
    if (attribute !== undefined) {
      byteStridePerVertex += Math.max(attribute.bytesPerVertex, 4);
      vertexCount = attribute.count;
    }
  }
  const interleavedArray = new ArrayBuffer(byteStridePerVertex * vertexCount);
  const interleavedData = new AttributeData(interleavedArray);

  const interleavedGeometry = new Geometry();
  interleavedGeometry.indices = geometry.indices;

  let byteOffset = 0;
  for (const name in geometry.attributes) {
    const attribute = geometry.attributes[name];
    if (attribute !== undefined) {
      copyBytesUsingStride(
        interleavedArray,
        attribute.attributeData.arrayBuffer,
        attribute.bytesPerVertex,
        byteStridePerVertex,
        byteOffset
      );

      interleavedGeometry.attributes[name] = new Attribute(
        interleavedData,
        attribute.componentsPerVertex,
        attribute.componentType,
        byteStridePerVertex,
        byteOffset,
        attribute.normalized
      );
      byteOffset += Math.max(attribute.bytesPerVertex, 4);
    }
  }
  return interleavedGeometry;
}

export function computeVertexNormals(geometry: Geometry): void {
  const indicesAttribute = geometry.indices;
  const { attributes } = geometry;

  const positionAttribute = attributes.position;
  if (positionAttribute === undefined) {
    throw new Error('missing position attribute');
  }
  let normalAttribute = attributes.normal;
  if (normalAttribute === undefined) {
    normalAttribute = makeFloat32Attribute(
      new Float32Array(positionAttribute.count * 3),
      3
    );
    geometry.attributes.normal = normalAttribute;
  }

  // reset existing normals to zero

  const positions = makeVec3ViewFromAttribute(positionAttribute);
  const normals = makeVec3ViewFromAttribute(normalAttribute);

  normals.clear();

  const pA = new Vec3();
  const pB = new Vec3();
  const pC = new Vec3();
  const cb = new Vec3();
  const ab = new Vec3();

  const temp = new Vec3();

  // indexed elements

  if (indicesAttribute !== undefined) {
    const indices = new Uint32Array(indicesAttribute.attributeData.arrayBuffer);

    for (let i = 0, il = indices.length; i < il; i += 3) {
      const vA = indices[i + 0];
      const vB = indices[i + 1];
      const vC = indices[i + 2];

      positions.get(vA, pA);
      positions.get(vB, pB);
      positions.get(vC, pC);

      vec3Subtract(pC, pB, cb);
      vec3Subtract(pA, pB, ab);
      vec3Cross(cb, ab, cb);

      normals.get(vA, temp);
      vec3Add(temp, cb, temp);
      normals.set(vA, temp);

      normals.get(vB, temp);
      vec3Add(temp, cb, temp);
      normals.set(vB, temp);

      normals.get(vC, temp);
      vec3Add(temp, cb, temp);
      normals.set(vC, temp);
    }
  } else {
    // non-indexed elements (unconnected triangle soup)

    for (let i = 0, il = positions.count; i < il; i += 3) {
      positions.get(i, pA);
      positions.get(i + 1, pB);
      positions.get(i + 2, pC);

      vec3Subtract(pC, pB, cb);
      vec3Subtract(pA, pB, ab);
      vec3Cross(cb, ab, cb);

      for (let j = 0; j < 3; j++) {
        normals.get(i + j, temp);
        vec3Add(temp, cb, temp);
        normals.set(i + j, temp);
      }
    }
  }

  for (let i = 0, il = normals.count; i < il; i += 3) {
    normals.set(i, vec3Normalize(normals.get(i, temp), temp));
  }
}

export function transformGeometry(geometry: Geometry, m: Mat4): void {
  const positionAttribute = geometry.attributes.position;
  if (positionAttribute === undefined) {
    throw new Error('missing position attribute');
  }
  const positions = makeVec3ViewFromAttribute(positionAttribute);

  const v = new Vec3();
  for (let i = 0; i < positions.count; i++) {
    positions.get(i, v);
    mat4TransformVec3(m, v, v);
    positions.set(i, v);
  }

  const normalAttribute = geometry.attributes.normal;
  if (normalAttribute !== undefined) {
    const normals = makeVec3ViewFromAttribute(normalAttribute);
    for (let i = 0; i < normals.count; i++) {
      normals.get(i, v);
      mat4TransformNormal3(m, v, v);
      normals.set(i, v);
    }
  }
}

export function positionAttributeToBoundingBox(
  positionAttribute?: Attribute,
  result = new Box3()
): Box3 {
  if (positionAttribute === undefined) {
    throw new Error('missing position attribute');
  }
  const positions = makeVec3ViewFromAttribute(positionAttribute);

  return vec3ViewBoundingBox(positions);
}

export function positionAttributeToBoundingSphere(
  positionAttribute?: Attribute,
  result = new Sphere()
): Sphere {
  if (positionAttribute === undefined) {
    throw new Error('missing position attribute');
  }
  const positions = makeVec3ViewFromAttribute(positionAttribute);

  const average = vec3ViewAverage(positions);
  const maxDistance = vec3ViewMaxDistance(positions, average);

  result.center.copy(average);
  result.radius = maxDistance;
  return result;
}

export function geometryToBoundingBox(geometry: Geometry): Box3 {
  return positionAttributeToBoundingBox(geometry.attributes.position);
}
export function geometryToBoundingSphere(geometry: Geometry): Sphere {
  return positionAttributeToBoundingSphere(geometry.attributes.position);
}

export function transformGeometryToUnitBox(geometry: Geometry) {
  const boundingBox = geometryToBoundingBox(geometry);

  const translation = box3Center(boundingBox);

  const scale = box3Size(boundingBox);
  const maxScale = vec3MaxComponent(scale);
  const uniformScale = new Vec3(maxScale, maxScale, maxScale);

  const transform = new Mat4();
  mat4Multiply(
    transform,
    scale3ToMat4(vec3Reciprocal(uniformScale)),
    transform
  );
  mat4Multiply(
    transform,
    translation3ToMat4(vec3Negate(translation)),
    transform
  );

  transformGeometry(geometry, transform);
}

export function getTransformToUnitSphere(geometry: Geometry) {
  const boundingSphere = geometryToBoundingSphere(geometry);
  const boundingBox = sphereToBox3(boundingSphere);
  const translation = box3Center(boundingBox);

  const scale = box3Size(boundingBox);
  const maxScale = vec3MaxComponent(scale);
  const uniformScale = new Vec3(maxScale, maxScale, maxScale);

  const transform = new Mat4();
  mat4Multiply(
    transform,
    scale3ToMat4(vec3Reciprocal(uniformScale)),
    transform
  );
  mat4Multiply(
    transform,
    translation3ToMat4(vec3Negate(translation)),
    transform
  );
  return transform;
}

export function makeVec3ViewFromAttribute(
  attribute: Attribute
): PrimitiveView<Vec3> {
  return makeVec3View(
    attribute.attributeData.arrayBuffer,
    attribute.bytesPerVertex / 4,
    attribute.byteOffset / 4
  );
}

export function vec3ViewBoundingBox(
  positions: PrimitiveView<Vec3>,
  result = new Box3()
): Box3 {
  box3Empty(result);
  const tempPosition = new Vec3();
  for (let i = 0; i < positions.count; i++) {
    box3ExpandByPoint3(result, positions.get(i, tempPosition), result);
  }
  return result;
}

export function vec3ViewAverage(
  positions: PrimitiveView<Vec3>,
  average = new Vec3()
): Vec3 {
  // TODO: replace with a reduce for better accuracy, any time you do a linear additiona like this, it can be very inaccurate for large numbers.
  const sumOfPositions = new Vec3();
  const tempPosition = new Vec3();
  for (let i = 0; i < positions.count; i++) {
    vec3Add(sumOfPositions, positions.get(i, tempPosition), sumOfPositions);
  }
  vec3MultiplyByScalar(sumOfPositions, 1 / positions.count, average);
  return average;
}

export function vec3ViewMaxDistance(
  positions: PrimitiveView<Vec3>,
  point: Vec3
): number {
  let maxDistanceSq = 0;
  const tempPosition = new Vec3();
  for (let i = 0; i < positions.count; i++) {
    const distanceSq = vec3DistanceSq(positions.get(i, tempPosition), point);
    maxDistanceSq = Math.max(distanceSq, maxDistanceSq);
  }
  return Math.sqrt(maxDistanceSq);
}
