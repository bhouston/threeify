import {
  Euler3,
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

import { SceneNode } from './SceneNode';

function toString(obj: any) {
  if (typeof obj === 'string') {
    return obj;
  }
  if (typeof obj === 'number') {
    return obj;
  }
  if (typeof obj === 'boolean') {
    return obj;
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
  }
  return obj;
}
export function sceneNodeToJson(sceneNode: SceneNode): object {
  const properties = {
    translation: vec3ToString(sceneNode.translation),
    rotation: quatToString(sceneNode.rotation),
    scale: vec3ToString(sceneNode.scale),
    visible: sceneNode.visible
  };

  const children = sceneNode.children.map((child) => sceneNodeToJson(child));
  const json: object = {
    type: sceneNode.constructor.name,
    name: sceneNode.name,
    properties,
    children
  };

  return json;
}
