//
// basic shader material
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { IDisposable, IIdentifiable } from '../core/types.js';

export class ShaderMaterial implements IIdentifiable, IDisposable {
  uuid: string = generateUUID();
  disposed = false;
  name = '';

  constructor(
    public vertexShaderCode: string,
    public fragmentShaderCode: string,
    public glslVersion = 300
  ) {}

  dispose(): void {
    this.disposed = true;
  }
}
