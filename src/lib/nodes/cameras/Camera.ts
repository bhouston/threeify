//
// based on Camera from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from '../../math/Matrix4.js';
import { Node } from '../Node.js';

export abstract class Camera extends Node {
	pixelAspectRatio: number = 1.0;

	super() {}

	abstract toProjectionMatrix(viewAspectRatio: number): Matrix4;
}
