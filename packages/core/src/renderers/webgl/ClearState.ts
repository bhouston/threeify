//
// OpenGL-compatible clear state
//
// Authors:
// * @bhouston
//

import { Color3, color3Equals } from '@threeify/math';

import { ICloneable, IEquatable } from '../../core/types';

export class ClearState
  implements ICloneable<ClearState>, IEquatable<ClearState>
{
  constructor(
    public color = Color3.Black,
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
