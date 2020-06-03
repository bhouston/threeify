//
// OpenGL-compatible mask state
//
// Authors:
// * @bhouston
//

export class MaskState {
    red: boolean = true;
    green: boolean = true;
    blue: boolean = true;
	alpha: boolean = true;
	depth: boolean = true;
	stencil: number = 0; // bitmask
}
