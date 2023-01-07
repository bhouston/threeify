//
// basic shader material
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../core/generateUuid.js';
import { IDisposable, IIdentifiable, IVersionable } from '../core/types.js';
import { IPoolUser } from '../renderers/Pool.js';

export class ShaderMaterial
  implements IIdentifiable, IVersionable, IDisposable, IPoolUser
{
  uuid: string = generateUUID();
  version = 0;
  disposed = false;
  name = '';

  constructor(
    public vertexShaderCode: string,
    public fragmentShaderCode: string,
    public glslVersion = 300
  ) {}

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    this.disposed = true;
    this.dirty();
  }
}
