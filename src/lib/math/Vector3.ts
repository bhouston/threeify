//
// based on Vector3 from Three.js
//
// Authors:
// * @bhouston
//

import { Matrix4 } from 'Matrix4.js';
import { IPrimitive } from './IPrimitive.js';
import { hashFloat3 } from '../hash.js';

export class Vector3 implements IPrimitive<Vector3> {
	x: number;
	y: number;
	z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
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

	get depth() {
		return this.z;
	}
	set depth(depth: number) {
		this.z = depth;
	}

	getHashCode() {
		return hashFloat3( this.x, this.y, this.z );
	}

	clone() {
		return new Vector3().copy(this);
	}

	copy(v: Vector3) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.x;

		return this;
	}

	add(v: Vector3) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;
	}

	getComponent(index: number) {
		switch (index) {
			case 0:
				return this.x;
			case 1:
				return this.y;
			case 2:
				return this.z;
			default:
				throw new Error('index of our range: ' + index);
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
			case 2:
				this.z = value;
				break;
			default:
				throw new Error('index of our range: ' + index);
		}

		return this;
	}

	numComponents() {
		return 3;
	}

	dot(v: Vector3) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	applyMatrix4(m: Matrix4) {
		let x = this.x,
			y = this.y,
			z = this.z;
		let e = m.elements;

		let w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

		this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
		this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
		this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

		return this;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	equals(v: Vector3) {
		return v.x === this.x && v.y === this.y && v.z === this.z;
	}

	setFromArray(floatArray: Float32Array, offset: number) {
		this.x = floatArray[offset + 0];
		this.y = floatArray[offset + 1];
		this.z = floatArray[offset + 2];
	}

	toArray(floatArray: Float32Array, offset: number) {
		floatArray[offset + 0] = this.x;
		floatArray[offset + 1] = this.y;
		floatArray[offset + 2] = this.z;
	}
}
