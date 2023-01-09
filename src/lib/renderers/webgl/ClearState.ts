//
// OpenGL-compatible clear state
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable } from '../../core/types.js';
import { Vec3 } from '../../math/Vec3.js';

export class ClearState
  implements ICloneable<ClearState>, IEquatable<ClearState>
{
  // TODO: Should be intialized to default WebGL states
  constructor(
    public color = new Vec3(1, 1, 1),
    public alpha = 0,
    public depth = 1,
    public stencil = 0
  ) {}

  clone(): ClearState {
    return new ClearState(this.color, this.alpha, this.depth, this.stencil);
  }

  copy(cs: ClearState): void {
    this.color.copy(cs.color);
    this.alpha = cs.alpha;
    this.depth = cs.depth;
    this.stencil = cs.stencil;
  }

  equals(cs: ClearState): boolean {
    return (
      this.color.equals(cs.color) &&
      this.alpha === cs.alpha &&
      this.depth === cs.depth &&
      this.stencil === cs.stencil
    );
  }
}
