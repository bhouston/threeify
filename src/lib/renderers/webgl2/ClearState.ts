//
// OpenGL-compatible clear state
//
// Authors:
// * @bhouston
//

import { Color } from '../../math/Color.js';

export class ClearState {
	color: Color = new Color();
	alpha: number = 0;
	depth: number = 1; // float
	stencil: number = 0; // integer
}
