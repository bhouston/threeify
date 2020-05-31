

import { Node } from '../Node.js';
import { Matrix4 } from '../../math/Matrix4.js';

export abstract class Camera extends Node {

    pixelAspectRatio: number = 1.0;

    super() {
    }

	copy( c: Camera ) {

        super.copy( c );

		this.pixelAspectRatio = c.pixelAspectRatio;

        return this;

    }

    abstract toProjectionMatrix( viewAspectRatio: number ): Matrix4;

}
