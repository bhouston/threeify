//
// OpenGL-compatible mask state
//
// Authors:
// * @bhouston
//

import { ICloneable, IEquatable } from "../../core/types";

export class MaskState implements ICloneable<MaskState>, IEquatable<MaskState> {
  // TODO: Should be intialized to default WebGL states
  constructor(
    public red = true,
    public green = true,
    public blue = true,
    public alpha = true,
    public depth = true,
    public stencil = 0,
  ) {}

  clone(): MaskState {
    return new MaskState(this.red, this.green, this.blue, this.alpha, this.depth, this.stencil);
  }

  copy(ms: MaskState): void {
    this.red = ms.red;
    this.green = ms.green;
    this.blue = ms.blue;
    this.alpha = ms.alpha;
    this.depth = ms.depth;
    this.stencil = ms.stencil;
  }

  equals(ms: MaskState): boolean {
    return (
      this.red === ms.red
      && this.green === ms.green
      && this.blue === ms.blue
      && this.alpha === ms.alpha
      && this.depth === ms.depth
      && this.stencil === ms.stencil
    );
  }
}
