import { generateUUID } from '../core/generateUuid';
import { IIdentifiable, IVersionable } from '../core/types';
import { ShaderDefines } from '../renderers/webgl/shaders/ShaderDefines';
import { MaterialParameters } from './MaterialParameters';

export interface IMaterialProps {
  id?: string;
  shaderName: string;
  shaderDefines?: ShaderDefines;
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

  getParameters(): MaterialParameters {
    return {};
  }

  dirty(): void {
    this.version++;
  }
}
