//
// OpenGL-compatible clear state
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable } from '../../core/types.js';
import { color3Equals } from '../../math/Color3.Functions.js';
import { Color3 } from '../../math/Color3.js';

export class ClearState
  implements ICloneable<ClearState>, IEquatable<ClearState>
{
  constructor(
    public color = new Color3(0, 0, 0),
    public alpha = 1,
    public depth = 1,
    public stencil = 0
  ) {}

  clone(): ClearState {
    return new ClearState(this.color, this.alpha, this.depth, this.stencil);
  }

  copy(cs: ClearState): void {
    cs.color.clone(this.color);
    this.alpha = cs.alpha;
    this.depth = cs.depth;
    this.stencil = cs.stencil;
  }

  equals(cs: ClearState): boolean {
    return (
      color3Equals(this.color, cs.color) &&
      this.alpha === cs.alpha &&
      this.depth === cs.depth &&
      this.stencil === cs.stencil
    );
  }
}
