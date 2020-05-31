

import { Node } from '../Node.js';
import { Matrix4 } from '../../math/Matrix4.js';

export class Camera extends Node {

    worldToLocal: Matrix4 = new Matrix4();
    localToScreenProjection: Matrix4 = new Matrix4();
    screenToLocalUnprojection: Matrix4 = new Matrix4();
    pixelAspectRatio: number = 1.0;

    super() {
    }

	copy( c: Camera ) {

        super.copy( c );

		this.worldToLocal.copy( c.localToWorldInverse );
		this.localToScreenProjection.copy( c.localToScreenProjection );
		this.screenToLocalUnprojection.copy( c.screenToLocalUnprojection );
		this.pixelAspectRatio = c.pixelAspectRatio;

        return this;

    }

}
