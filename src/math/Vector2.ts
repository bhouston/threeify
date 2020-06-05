//
// based on Vector2 from Three.js
//
// Authors:
// * @bhouston
//

import { IPrimitive } from './IPrimitive.js';
import { hashFloat2 } from '../model/hash.js';

export class Vector2 implements IPrimitive<Vector2> {
	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	get width() {
		return this.x;
	}
	set width(width: number) {
		this.x = width;
	}

	get height() {
		return this.y;
	}
	set height(height: number) {
		this.y = height;
	}

	getHashCode() {
		return hashFloat2(this.x, this.y);
	}

	clone() {
		return new Vector2().copy(this);
	}

	copy(v: Vector2) {
		this.x = v.x;
		this.y = v.y;

		return this;
	}

	add(v: Vector2) {
		this.x += v.x;
		this.y += v.y;

		return this;
	}

	sub(v: Vector2) {
		this.x -= v.x;
		this.y -= v.y;

		return this;
	}

	getComponent(index: number) {
		switch (index) {
			case 0:
				return this.x;
			case 1:
				return this.y;
			default:
				throw new Error(`index of our range: ${index}`);
		}
	}

	setComponent(index: number, value: number) {
		switch (index) {
			case 0:
				this.x = value;
				break;
			case 1:
				this.y = value;
				break;
			default:
				throw new Error(`index of our range: ${index}`);
		}

		return this;
	}

	numComponents() {
		return 3;
	}

	dot(v: Vector2) {
		return this.x * v.x + this.y * v.y;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	min(v: Vector2) {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);

		return this;
	}

	max(v: Vector2) {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);

		return this;
	}

	clamp(min: Vector2, max: Vector2) {
		// assumes min < max, componentwise

		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));

		return this;
	}

	equals(v: Vector2) {
		return v.x === this.x && v.y === this.y;
	}

	setFromArray(floatArray: Float32Array, offset: number) {
		this.x = floatArray[offset + 0];
		this.y = floatArray[offset + 1];
	}

	toArray(floatArray: Float32Array, offset: number) {
		floatArray[offset + 0] = this.x;
		floatArray[offset + 1] = this.y;
	}
}
