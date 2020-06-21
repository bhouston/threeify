import { Vector3Array } from "../math/arrays/Vector3Array";
import { Vector3 } from "../math/Vector3";
import { Attribute, Float32Attribute } from "./Attribute";
import { AttributeData } from "./AttributeData";
import { Geometry } from "./Geometry";

function copyBytesUsingStride(
  dest: ArrayBuffer,
  source: ArrayBuffer,
  bytesPerVertex: number,
  byteStridePerVertex: number,
  attributeOffset: number,
): void {
  const destBytes = new Int8Array(dest);
  const sourceBytes = new Int8Array(source);
  // console.log("destBytes", destBytes);
  // console.log("sourceBytes", sourceBytes);
  const vertexCount = source.byteLength / bytesPerVertex;
  for (let v = 0; v < vertexCount; v++) {
    const sourceOffset = v * bytesPerVertex;
    const destOffset = v * byteStridePerVertex + attributeOffset;
    // console.log(sourceOffset, "->", destOffset, "length: ", bytesPerVertex);
    for (let i = 0; i < bytesPerVertex; i++) {
      /* console.log(
        " destBytes[",
        destOffset + i,
        "] = sourceBytes[ ",
        sourceOffset + i,
        "]: ",
        sourceBytes[sourceOffset + i],
      );*/
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
      byteStridePerVertex += attribute.bytesPerVertex;
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
        byteOffset,
      );

      interleavedGeometry.attributes[name] = new Attribute(
        interleavedData,
        attribute.componentsPerVertex,
        attribute.componentType,
        byteStridePerVertex,
        byteOffset,
      );
      byteOffset += attribute.bytesPerVertex;
    }
  }
  return interleavedGeometry;
}

export function computeVertexNormals(geometry: Geometry): void {
  const indicesAttribute = geometry.indices;
  const attributes = geometry.attributes;

  const positionAttribute = attributes["position"];
  if (positionAttribute === undefined) {
    throw new Error("missing position attribute");
  }
  let normalAttribute = attributes["normal"];
  if (normalAttribute === undefined) {
    normalAttribute = new Float32Attribute(new Float32Array(positionAttribute.count * 3), 3);
    geometry.attributes["normal"] = normalAttribute;
  }

  // reset existing normals to zero

  const positions = new Vector3Array(positionAttribute.attributeData.arrayBuffer);
  const normals = new Vector3Array(normalAttribute.attributeData.arrayBuffer);

  for (let i = 0, il = normals.count; i < il; i++) {
    normals.set(i, new Vector3());
  }

  const pA = new Vector3();
  const pB = new Vector3();
  const pC = new Vector3();
  const cb = new Vector3();
  const ab = new Vector3();

  // indexed elements

  if (indicesAttribute !== undefined) {
    const indices = new Uint32Array(indicesAttribute.attributeData.arrayBuffer);

    const v = new Vector3();

    for (let i = 0, il = indices.length; i < il; i += 3) {
      const vA = indices[i + 0];
      const vB = indices[i + 1];
      const vC = indices[i + 2];

      positions.get(vA, pA);
      positions.get(vB, pB);
      positions.get(vC, pC);

      cb.copy(pC).sub(pB);
      ab.copy(pA).sub(pB);
      cb.cross(ab);

      normals.add(vA, cb);
      normals.add(vB, cb);
      normals.add(vC, cb);
    }
  } else {
    // non-indexed elements (unconnected triangle soup)
    const v = new Vector3();

    for (let i = 0, il = positions.count; i < il; i += 3) {
      positions.get(i, pA);
      positions.get(i + 1, pB);
      positions.get(i + 2, pC);

      cb.copy(pC).sub(pB);
      ab.copy(pA).sub(pB);
      cb.cross(ab);

      normals.add(i, cb);
      normals.add(i + 1, cb);
      normals.add(i + 2, cb);
    }
  }

  const v = new Vector3();
  for (let i = 0, il = normals.count; i < il; i += 3) {
    normals.set(i, normals.get(i, v).normalize());
  }
}
