import {
  Box3,
  box3ToString,
  Euler3,
  euler3ToString,
  Mat3,
  mat3ToString,
  Mat4,
  mat4ToString,
  Quat,
  quatToString,
  Vec2,
  vec2ToString,
  Vec3,
  vec3ToString,
  Vec4,
  vec4ToString
} from '@threeify/math';

import { MeshNode } from './Mesh';
import { SceneNode } from './SceneNode';

function toString(obj: any): string {
  if (typeof obj === 'string') {
    return obj;
  }
  if (typeof obj === 'number') {
    return obj.toString();
  }
  if (typeof obj === 'boolean') {
    return obj.toString();
  }
  if (typeof obj === 'object' && obj !== null) {
    if (obj instanceof Vec3) {
      return vec3ToString(obj);
    }
    if (obj instanceof Vec2) {
      return vec2ToString(obj);
    }
    if (obj instanceof Vec4) {
      return vec4ToString(obj);
    }
    if (obj instanceof Mat3) {
      return mat3ToString(obj);
    }
    if (obj instanceof Mat4) {
      return mat4ToString(obj);
    }
    if (obj instanceof Quat) {
      return quatToString(obj);
    }
    if (obj instanceof Euler3) {
      return euler3ToString(obj);
    }
    if (obj instanceof Box3) {
      return box3ToString(obj);
    }
  }
  return obj;
}
export function sceneNodeToJson(sceneNode: SceneNode): object {
  const json: any = {
    type: sceneNode.constructor.name,
    name: sceneNode.name,
    visible: sceneNode.visible
  };

  const transform: any = {};
  const transformNames = ['translation', 'scale', 'rotation'];
  for (const propertyName of transformNames) {
    if (propertyName in sceneNode) {
      transform[propertyName] = toString((sceneNode as any)[propertyName]);
    }
  }
  json.transform = transform;

  const properties: any = {};
  const propertyNames = [
    'color',
    'intensity',
    'fov',
    'near',
    'far',
    'range',
    'innerConeAngle',
    'outerConeAngle',
    'power',
    'direction',
    'verticalFov',
    'zoom',
    'aspectRatio'
  ];
  for (const propertyName of propertyNames) {
    if (propertyName in sceneNode) {
      properties[propertyName] = toString((sceneNode as any)[propertyName]);
    }
  }
  if (properties.length > 0) {
    json.properties = properties;
  }

  if (sceneNode.children.length > 0) {
    json.children = sceneNode.children.map((child) => sceneNodeToJson(child));
  }

  if (sceneNode instanceof MeshNode) {
    const geometry = sceneNode.geometry;
    const mesh: any = {
      faces: geometry.indices?.count,
      vertices: geometry.attributes.position?.count,
      normals: geometry.attributes.normal?.count,
      tangents: geometry.attributes.tangent?.count,
      uv0: geometry.attributes.uv0?.count,
      uv1: geometry.attributes.uv1?.count,
      uv2: geometry.attributes.uv2?.count
    };
    json.mesh = mesh;

    const material = sceneNode.material;
    const materialJson: any = {
      type: material.constructor.name
    };
    const materialNames = Object.getOwnPropertyNames(material);
    for (const propertyName of materialNames) {
      if (propertyName in material) {
        materialJson[propertyName] = toString((material as any)[propertyName]);
      }
    }
    json.material = material;
  }

  return json;
}
