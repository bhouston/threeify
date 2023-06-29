//
// basic shader material
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { IDisposable, IIdentifiable } from '../core/types.js';

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
