//
// based on PerspectiveCamera from Three.js
//
// Authors:
// * @bhouston
//

import { Camera } from './Camera.js';
import { Matrix4 } from '../../math/Matrix4.js';

export class PerspectiveCamera extends Camera {

    verticalFov: number;
    zoom: number;
    near: number;
    far: number;

    constructor( verticalFov: number, near: number, far: number, zoom: number = 1.0 ) {

        super();

        this.verticalFov = verticalFov;
        this.near = near;
        this.far = far;
        this.zoom = zoom;

    }


	copy( c: PerspectiveCamera ) {

        super.copy( c );

	    this.verticalFov = c.verticalFov;
        this.near = c.near;
        this.far = c.far;
        this.zoom = c.zoom;

		return this;

    }

    toProjectionMatrix( viewAspectRatio: number ) : Matrix4 {
       
        let height = 2.0 * this.near * Math.tan( this.verticalFov * Math.PI / 180.0 ) / this.zoom;
        let width = height * this.pixelAspectRatio * viewAspectRatio;
        
        let left = - width * 0.5;
        let right = left + width;

        let top = - height * 0.5;
        let bottom = -top + height;

		return new Matrix4().makePerspectiveProjection( left, right, top, bottom, this.near, this.far );

	}

}
