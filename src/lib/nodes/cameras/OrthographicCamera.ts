//
// based on OrthographicCamera from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from '../../math/Matrix4.js';
import { Vector2 } from '../../math/Vector2.js';
import { Camera } from './Camera.js';

export class OrthographicCamera extends Camera {
	height: number;
	near: number;
	far: number;
	center: Vector2;
	zoom: number;

	constructor(
		height: number,
		near: number,
		far: number,
		center = new Vector2(0, 0),
		zoom: number = 1,
	) {
		super();

		this.height = height;
		this.near = near;
		this.far = far;
		this.center = center;
		this.zoom = zoom;
	}

	copy(c: OrthographicCamera) {
		super.copy(c);

		this.height = c.height;
		this.near = c.near;
		this.far = c.far;
		this.center.copy(c.center);
		this.zoom = c.zoom;

		return this;
	}

	toProjectionMatrix(viewAspectRatio: number): Matrix4 {
		let width =
			(this.height * viewAspectRatio * this.pixelAspectRatio) / this.zoom;

		let left = -width * 0.5 + this.center.x;
		let right = left + width;

		let top = -this.height * 0.5 + this.center.y;
		let bottom = top + this.height;

		return new Matrix4().makeOrthographicProjection(
			left,
			right,
			top,
			bottom,
			this.near,
			this.far,
		);
	}
}
