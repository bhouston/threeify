//
// OpenGL-compatible mask state
//
// Authors:
// * @bhouston
//

import { ICloneable } from "../../interfaces/Standard";

export class MaskState implements ICloneable<MaskState> {
	red: boolean;
	green: boolean;
	blue: boolean;
	alpha: boolean;
	depth: boolean;
	stencil: number; // bitmask


	constructor(red: boolean = true, green: boolean = true, blue: boolean = true, alpha: boolean = true, depth: boolean = true, stencil: number = 0 ) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
		this.depth = depth;
		this.stencil = stencil;
	}

	clone() {
		return new MaskState( this.red, this.green, this.blue, this.alpha, this.depth, this.stencil );
	}

	copy( ms: MaskState ) {
		this.red = ms.red;
		this.green = ms.green;
		this.blue = ms.blue;
		this.alpha = ms.alpha;
		this.depth = ms.depth;
		this.stencil = ms.stencil;
	}
}
