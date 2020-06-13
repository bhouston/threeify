//
// OpenGL-compatible clear state
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable } from "../../core/types";
import { Color } from "../../math/Color";

export class ClearState implements ICloneable<ClearState>, IEquatable<ClearState> {
  constructor(public color: Color = new Color(), public alpha = 0, public depth = 1, public stencil = 0) {}

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
      this.color.equals(cs.color) && this.alpha === cs.alpha && this.depth === cs.depth && this.stencil === cs.stencil
    );
  }
}
