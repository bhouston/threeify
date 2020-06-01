//
// based on Color from Three.js
//
// Authors:
// * @bhouston
//

import { IPrimitive } from "./IPrimitive.js";


function hue2rgb(p: number, q: number, t: number) {

	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);

	return p;

}

export class Color implements IPrimitive<Color> {

	r: number;
	g: number;
	b: number;

	constructor(r: number = 0, g: number = 0, b: number = 0) {

		this.r = r;
		this.g = g;
		this.b = b;

	}

	clone() {

		return new Color().copy(this);

	}

	copy(c: Color) {

		this.r = c.r;
		this.g = c.g;
		this.b = c.b;

		return this;
	}

	add(c: Color) {

		this.r += c.r;
		this.g += c.g;
		this.b += c.b;

		return this;

	}

	setFromHex(hex: number) {

		hex = Math.floor(hex);

		this.r = (hex >> 16 & 255) / 255;
		this.g = (hex >> 8 & 255) / 255;
		this.b = (hex & 255) / 255;

		return this;

	}

	setFromHSL(h: number, s: number, l: number) {

		// h,s,l ranges are in 0.0 - 1.0
		h = ((h % 1.0) + 1.0) % 1.0; // euclidean modulo
		s = Math.min(Math.max(s, 0.0), 1.0);
		l = Math.min(Math.max(l, 0.0), 1.0);

		if (s === 0) {

			this.r = this.g = this.b = l;

		} else {

			let p = (l <= 0.5) ? l * (1.0 + s) : l + s - (l * s);
			let q = (2.0 * l) - p;

			this.r = hue2rgb(q, p, h + 1.0 / 3.0);
			this.g = hue2rgb(q, p, h);
			this.b = hue2rgb(q, p, h - 1.0 / 3.0);

		}

		return this;

	}

	getComponent(index: number) {

		switch (index) {
			case 0: return this.r;
			case 1: return this.g;
			case 2: return this.b;
			default: throw new Error("index of our range: " + index);
		}

	}


	setComponent(index: number, value: number) {

		switch (index) {
			case 0: this.r = value; break;
			case 1: this.g = value; break;
			case 2: this.b = value; break;
			default: throw new Error("index of our range: " + index);
		}

		return this;
	}

	toHex() {

		return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0;

	}

	toHexString() {

		return ('000000' + this.toHex().toString(16)).slice(- 6);

	}

	equals( c: Color ) {

		return (c.r === this.r) && (c.g === this.g) && (c.b === this.b);

	}

}
