import {
  AlphaMode,
  generateUUID,
  IIdentifiable,
  IVersionable,
  ShaderDefines
} from '@threeify/core';

import {
  IMaterialParameterProvider,
  MaterialParameters
} from './MaterialParameters.js';

export interface IMaterialProps {
  id?: string;
  shaderName: string;
  shaderDefines?: ShaderDefines;
  name?: string;
}

export class Material
  implements IVersionable, IIdentifiable, IMaterialParameterProvider
{
  public readonly id;
  public version = 0;
  public name = '';
  public shaderName: string;
  public shaderDefines: ShaderDefines = {};
  public alphaMode = AlphaMode.Opaque;

  constructor(props: IMaterialProps) {
    this.id = props.id || generateUUID();
    this.shaderName = props.shaderName;
    this.shaderDefines = props.shaderDefines || this.shaderDefines;
    this.name = props.name || this.name;
  }

  getParameters(): MaterialParameters {
    return {};
  }

  dirty(): void {
    this.version++;
  }
}
