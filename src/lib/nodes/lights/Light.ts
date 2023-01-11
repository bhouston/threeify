//
// basic light node initially based on Light from Three.js
//
// Authors:
// * @bhouston
//

import { Color3 } from '../../math/Color3.js';
import { Node } from '../Node.js';
import { LightType } from './LightType.js';

export class Light extends Node {
  /**
   * @param color - RGB value for light's color in linear space.
   * @param intensity - Brightness of light.  Units depend on the light type.
   */
  constructor(
    public readonly type: LightType,
    public color = new Color3(1, 1, 1),
    public intensity = 1
  ) {
    super();
  }
}
