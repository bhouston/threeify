//
// OpenGL-compatible clear state
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable } from "../../core/types";
import { Color } from "../../math/Color";

export class ClearState implements ICloneable<ClearState>, IEquatable<ClearState> {
  color: Color;
  alpha: number;
  depth: number; // float
  stencil: number; // integer

  constructor(color: Color = new Color(), alpha = 0, depth = 1, stencil = 0) {
    this.color = color;
    this.alpha = alpha;
    this.depth = depth;
    this.stencil = stencil;
  }

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
