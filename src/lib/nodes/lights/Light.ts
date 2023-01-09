//
// basic light node initially based on Light from Three.js
//
// Authors:
// * @bhouston
//

import { Vec3 } from '../../math/Vec3.js';
import { Node } from '../Node.js';
import { LightType } from './LightType.js';

export class Light extends Node {
  /**
   * @param color - RGB value for light's color in linear space.
   * @param intensity - Brightness of light.  Units depend on the light type.
   */
  constructor(
    public readonly type: LightType,
    public color: Vec3 = new Vec3(1, 1, 1),
    public intensity = 1
  ) {
    super();
  }
}
