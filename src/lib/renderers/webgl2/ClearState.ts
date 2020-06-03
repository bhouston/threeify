//
// OpenGL-compatible clear state
//
// Authors:
// * @bhouston
//

import { Color } from '../../math/Color.js';
import { ICloneable } from '../../interfaces/Standard.js';

export class ClearState implements ICloneable<ClearState> {
	color: Color;
	alpha: number;
	depth: number; // float
	stencil: number; // integer

	constructor(color: Color = new Color(), alpha: number = 0, depth: number = 1, stencil: number = 0 ) {
		this.color = color;
		this.alpha = alpha;
		this.depth = depth;
		this.stencil = stencil;
	}

	clone() {
		return new ClearState( this.color, this.alpha, this.depth, this.stencil );
	}

	copy( cs: ClearState ) {
		this.color.copy( cs.color );
		this.alpha = cs.alpha;
		this.depth = cs.depth;
		this.stencil = cs.stencil;
	}

}
