import { generateUUID } from '../core/generateUuid';
import { IIdentifiable, IVersionable } from '../core/types';
import { Color3 } from '../math/Color3';
import { Color4 } from '../math/Color4';
import { Mat3 } from '../math/Mat3';
import { Mat4 } from '../math/Mat4';
import { Vec2 } from '../math/Vec2';
import { Vec3 } from '../math/Vec3';
import { Vec4 } from '../math/Vec4';
import { TexImage2D } from '../renderers/webgl/textures/TexImage2D';
import { Texture } from '../textures/Texture';

export type MaterialUniformValue =
  | number
  | Vec2
  | Vec3
  | Vec4
  | Color3
  | Color4
  | Mat3
  | Mat4
  | Texture
  | TexImage2D;
export type MaterialUniforms = { [uniformName: string]: MaterialUniformValue };

export interface IMaterialProps {
  id?: string;
  shaderName: string;
  shaderDefines?: string[];
  name?: string;
}

export class Material implements IVersionable, IIdentifiable {
  public readonly id;
  public version = 0;
  public name = '';
  public shaderName: string;
  public shaderDefines: ShaderDefines = {};
  constructor(props: IMaterialProps) {
    this.id = props.id || generateUUID();
    this.shaderName = props.shaderName;
    this.shaderDefines = props.shaderDefines || this.shaderDefines;
    this.name = props.name || this.name;
  }

  getUniforms(): MaterialUniforms {
    return {};
  }

  dirty(): void {
    this.version++;
  }
}
