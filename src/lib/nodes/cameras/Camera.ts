

import { Node } from '../Node.js';
import { Matrix4 } from '../../math/Matrix4.js';

export class Camera extends Node {

    localToWorldInverse: Matrix4 = new Matrix4();
    projection: Matrix4 = new Matrix4();
    projectionInverse: Matrix4 = new Matrix4();

    super() {
    }

	copy( c: Camera ) {

        super.copy( c );

		this.localToWorldInverse.copy( c.localToWorldInverse );
		this.projection.copy( c.projection );
		this.projectionInverse.copy( c.projectionInverse );

		return this;

    }

}
