//
// basic shader material
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid';
import { IDisposable, IIdentifiable } from '../core/types';

export class ShaderMaterial implements IIdentifiable, IDisposable {
  public readonly id: string = generateUUID();
  public disposed = false;

  constructor(
    public name: string,
    public vertexShaderCode: string,
    public fragmentShaderCode: string,
    public glslVersion = 300
  ) {}

  dispose(): void {
    this.disposed = true;
  }
}
