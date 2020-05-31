import { Camera } from './Camera.js';
import { Node } from '../Node.js';
import { Matrix4 } from '../../math/Matrix4.js';

export class PerspectiveCamera extends Camera {

    verticalFov: number;
    near: number;
    far: number;
    pixelAspectRatio: number;

    constructor( verticalFov: number, near: number, far: number, pixelAspectRatio: number = 1.0 ) {

        super();

        this.verticalFov = verticalFov;
        this.near = near;
        this.far = far;
        this.pixelAspectRatio = pixelAspectRatio;

    }


	copy( c: PerspectiveCamera ) {

        super.copy( c );

	    this.verticalFov = c.verticalFov;
        this.near = c.near;
        this.far = c.far;

		return this;

    }

    updateProjectionMatrix: function () {

		var near = this.near,
			top = near * Math.tan( MathUtils.DEG2RAD * 0.5 * this.fov ) / this.zoom,
			height = 2 * top,
			width = this.aspect * height,
			left = - 0.5 * width,
			view = this.view;

		if ( this.view !== null && this.view.enabled ) {

			var fullWidth = view.fullWidth,
				fullHeight = view.fullHeight;

			left += view.offsetX * width / fullWidth;
			top -= view.offsetY * height / fullHeight;
			width *= view.width / fullWidth;
			height *= view.height / fullHeight;

		}

		var skew = this.filmOffset;
		if ( skew !== 0 ) left += near * skew / this.getFilmWidth();

		this.projectionMatrix.makePerspective( left, left + width, top, top - height, near, this.far );

		this.projectionMatrixInverse.getInverse( this.projectionMatrix );

	},

}
