//
// based on Matrix4 from Three.js
//
// Authors:
// * @bhouston
//

import { Euler, EulerOrder } from './Euler.js';
import { IPrimitive } from './IPrimitive.js';
import { Quaternion } from './Quaternion.js';
import { Vector3 } from './Vector3.js';

export class Matrix4 implements IPrimitive<Matrix4> {
	elements: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

	constructor() {}

	set(
		n11: number,
		n12: number,
		n13: number,
		n14: number,
		n21: number,
		n22: number,
		n23: number,
		n24: number,
		n31: number,
		n32: number,
		n33: number,
		n34: number,
		n41: number,
		n42: number,
		n43: number,
		n44: number,
	) {
		let te = this.elements;

		te[0] = n11;
		te[4] = n12;
		te[8] = n13;
		te[12] = n14;
		te[1] = n21;
		te[5] = n22;
		te[9] = n23;
		te[13] = n24;
		te[2] = n31;
		te[6] = n32;
		te[10] = n33;
		te[14] = n34;
		te[3] = n41;
		te[7] = n42;
		te[11] = n43;
		te[15] = n44;

		return this;
	}

	clone() {
		return new Matrix4().copy(this);
	}

	copy(m: Matrix4) {
		let te = this.elements;
		let me = m.elements;

		te[0] = me[0];
		te[1] = me[1];
		te[2] = me[2];
		te[3] = me[3];
		te[4] = me[4];
		te[5] = me[5];
		te[6] = me[6];
		te[7] = me[7];
		te[8] = me[8];
		te[9] = me[9];
		te[10] = me[10];
		te[11] = me[11];
		te[12] = me[12];
		te[13] = me[13];
		te[14] = me[14];
		te[15] = me[15];

		return this;
	}

	getComponent(index: number) {
		return this.elements[index];
	}

	setComponent(index: number, value: number) {
		this.elements[index] = value;

		return this;
	}

	numComponents() {
		return 16;
	}

	multiplyByScalar(s: number) {
		let te = this.elements;

		te[0] *= s;
		te[4] *= s;
		te[8] *= s;
		te[12] *= s;
		te[1] *= s;
		te[5] *= s;
		te[9] *= s;
		te[13] *= s;
		te[2] *= s;
		te[6] *= s;
		te[10] *= s;
		te[14] *= s;
		te[3] *= s;
		te[7] *= s;
		te[11] *= s;
		te[15] *= s;

		return this;
	}

	determinant() {
		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		let me = this.elements,
			n11 = me[0],
			n21 = me[1],
			n31 = me[2],
			n41 = me[3],
			n12 = me[4],
			n22 = me[5],
			n32 = me[6],
			n42 = me[7],
			n13 = me[8],
			n23 = me[9],
			n33 = me[10],
			n43 = me[11],
			n14 = me[12],
			n24 = me[13],
			n34 = me[14],
			n44 = me[15],
			t11 =
				n23 * n34 * n42 -
				n24 * n33 * n42 +
				n24 * n32 * n43 -
				n22 * n34 * n43 -
				n23 * n32 * n44 +
				n22 * n33 * n44,
			t12 =
				n14 * n33 * n42 -
				n13 * n34 * n42 -
				n14 * n32 * n43 +
				n12 * n34 * n43 +
				n13 * n32 * n44 -
				n12 * n33 * n44,
			t13 =
				n13 * n24 * n42 -
				n14 * n23 * n42 +
				n14 * n22 * n43 -
				n12 * n24 * n43 -
				n13 * n22 * n44 +
				n12 * n23 * n44,
			t14 =
				n14 * n23 * n32 -
				n13 * n24 * n32 -
				n14 * n22 * n33 +
				n12 * n24 * n33 +
				n13 * n22 * n34 -
				n12 * n23 * n34;

		return n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
	}

	transpose() {
		let te = this.elements;
		let tmp;

		tmp = te[1];
		te[1] = te[4];
		te[4] = tmp;
		tmp = te[2];
		te[2] = te[8];
		te[8] = tmp;
		tmp = te[6];
		te[6] = te[9];
		te[9] = tmp;

		tmp = te[3];
		te[3] = te[12];
		te[12] = tmp;
		tmp = te[7];
		te[7] = te[13];
		te[13] = tmp;
		tmp = te[11];
		te[11] = te[14];
		te[14] = tmp;

		return this;
	}

	invert() {
		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		let me = this.elements,
			n11 = me[0],
			n21 = me[1],
			n31 = me[2],
			n41 = me[3],
			n12 = me[4],
			n22 = me[5],
			n32 = me[6],
			n42 = me[7],
			n13 = me[8],
			n23 = me[9],
			n33 = me[10],
			n43 = me[11],
			n14 = me[12],
			n24 = me[13],
			n34 = me[14],
			n44 = me[15],
			t11 =
				n23 * n34 * n42 -
				n24 * n33 * n42 +
				n24 * n32 * n43 -
				n22 * n34 * n43 -
				n23 * n32 * n44 +
				n22 * n33 * n44,
			t12 =
				n14 * n33 * n42 -
				n13 * n34 * n42 -
				n14 * n32 * n43 +
				n12 * n34 * n43 +
				n13 * n32 * n44 -
				n12 * n33 * n44,
			t13 =
				n13 * n24 * n42 -
				n14 * n23 * n42 +
				n14 * n22 * n43 -
				n12 * n24 * n43 -
				n13 * n22 * n44 +
				n12 * n23 * n44,
			t14 =
				n14 * n23 * n32 -
				n13 * n24 * n32 -
				n14 * n22 * n33 +
				n12 * n24 * n33 +
				n13 * n22 * n34 -
				n12 * n23 * n34;

		let det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

		if (det === 0) throw new Error('can not invert degenerate matrix');

		let detInv = 1 / det;

		me[0] = t11 * detInv;
		me[1] =
			(n24 * n33 * n41 -
				n23 * n34 * n41 -
				n24 * n31 * n43 +
				n21 * n34 * n43 +
				n23 * n31 * n44 -
				n21 * n33 * n44) *
			detInv;
		me[2] =
			(n22 * n34 * n41 -
				n24 * n32 * n41 +
				n24 * n31 * n42 -
				n21 * n34 * n42 -
				n22 * n31 * n44 +
				n21 * n32 * n44) *
			detInv;
		me[3] =
			(n23 * n32 * n41 -
				n22 * n33 * n41 -
				n23 * n31 * n42 +
				n21 * n33 * n42 +
				n22 * n31 * n43 -
				n21 * n32 * n43) *
			detInv;

		me[4] = t12 * detInv;
		me[5] =
			(n13 * n34 * n41 -
				n14 * n33 * n41 +
				n14 * n31 * n43 -
				n11 * n34 * n43 -
				n13 * n31 * n44 +
				n11 * n33 * n44) *
			detInv;
		me[6] =
			(n14 * n32 * n41 -
				n12 * n34 * n41 -
				n14 * n31 * n42 +
				n11 * n34 * n42 +
				n12 * n31 * n44 -
				n11 * n32 * n44) *
			detInv;
		me[7] =
			(n12 * n33 * n41 -
				n13 * n32 * n41 +
				n13 * n31 * n42 -
				n11 * n33 * n42 -
				n12 * n31 * n43 +
				n11 * n32 * n43) *
			detInv;

		me[8] = t13 * detInv;
		me[9] =
			(n14 * n23 * n41 -
				n13 * n24 * n41 -
				n14 * n21 * n43 +
				n11 * n24 * n43 +
				n13 * n21 * n44 -
				n11 * n23 * n44) *
			detInv;
		me[10] =
			(n12 * n24 * n41 -
				n14 * n22 * n41 +
				n14 * n21 * n42 -
				n11 * n24 * n42 -
				n12 * n21 * n44 +
				n11 * n22 * n44) *
			detInv;
		me[11] =
			(n13 * n22 * n41 -
				n12 * n23 * n41 -
				n13 * n21 * n42 +
				n11 * n23 * n42 +
				n12 * n21 * n43 -
				n11 * n22 * n43) *
			detInv;

		me[12] = t14 * detInv;
		me[13] =
			(n13 * n24 * n31 -
				n14 * n23 * n31 +
				n14 * n21 * n33 -
				n11 * n24 * n33 -
				n13 * n21 * n34 +
				n11 * n23 * n34) *
			detInv;
		me[14] =
			(n14 * n22 * n31 -
				n12 * n24 * n31 -
				n14 * n21 * n32 +
				n11 * n24 * n32 +
				n12 * n21 * n34 -
				n11 * n22 * n34) *
			detInv;
		me[15] =
			(n12 * n23 * n31 -
				n13 * n22 * n31 +
				n13 * n21 * n32 -
				n11 * n23 * n32 -
				n12 * n21 * n33 +
				n11 * n22 * n33) *
			detInv;

		return this;
	}

	makeIdentity() {
		this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

		return this;
	}

	makeConcatenation(a: Matrix4, b: Matrix4) {
		let ae = a.elements;
		let be = b.elements;
		let te = this.elements;

		let a11 = ae[0],
			a12 = ae[4],
			a13 = ae[8],
			a14 = ae[12];
		let a21 = ae[1],
			a22 = ae[5],
			a23 = ae[9],
			a24 = ae[13];
		let a31 = ae[2],
			a32 = ae[6],
			a33 = ae[10],
			a34 = ae[14];
		let a41 = ae[3],
			a42 = ae[7],
			a43 = ae[11],
			a44 = ae[15];

		let b11 = be[0],
			b12 = be[4],
			b13 = be[8],
			b14 = be[12];
		let b21 = be[1],
			b22 = be[5],
			b23 = be[9],
			b24 = be[13];
		let b31 = be[2],
			b32 = be[6],
			b33 = be[10],
			b34 = be[14];
		let b41 = be[3],
			b42 = be[7],
			b43 = be[11],
			b44 = be[15];

		te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;
	}

	makeTranslation(x: number, y: number, z: number) {
		this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);

		return this;
	}

	makeRotationFromAngleAxis(axis: Vector3, angle: number) {
		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		let c = Math.cos(angle);
		let s = Math.sin(angle);
		let t = 1 - c;
		let x = axis.x,
			y = axis.y,
			z = axis.z;
		let tx = t * x,
			ty = t * y;

		this.set(
			tx * x + c,
			tx * y - s * z,
			tx * z + s * y,
			0,
			tx * y + s * z,
			ty * y + c,
			ty * z - s * x,
			0,
			tx * z - s * y,
			ty * z + s * x,
			t * z * z + c,
			0,
			0,
			0,
			0,
			1,
		);

		return this;
	}

	makeRotationFromEuler(euler: Euler) {
		let te = this.elements;

		let x = euler.x,
			y = euler.y,
			z = euler.z;
		let a = Math.cos(x),
			b = Math.sin(x);
		let c = Math.cos(y),
			d = Math.sin(y);
		let e = Math.cos(z),
			f = Math.sin(z);

		if (euler.order === EulerOrder.XYZ) {
			let ae = a * e,
				af = a * f,
				be = b * e,
				bf = b * f;

			te[0] = c * e;
			te[4] = -c * f;
			te[8] = d;

			te[1] = af + be * d;
			te[5] = ae - bf * d;
			te[9] = -b * c;

			te[2] = bf - ae * d;
			te[6] = be + af * d;
			te[10] = a * c;
		} else if (euler.order === EulerOrder.YXZ) {
			let ce = c * e,
				cf = c * f,
				de = d * e,
				df = d * f;

			te[0] = ce + df * b;
			te[4] = de * b - cf;
			te[8] = a * d;

			te[1] = a * f;
			te[5] = a * e;
			te[9] = -b;

			te[2] = cf * b - de;
			te[6] = df + ce * b;
			te[10] = a * c;
		} else if (euler.order === EulerOrder.ZXY) {
			let ce = c * e,
				cf = c * f,
				de = d * e,
				df = d * f;

			te[0] = ce - df * b;
			te[4] = -a * f;
			te[8] = de + cf * b;

			te[1] = cf + de * b;
			te[5] = a * e;
			te[9] = df - ce * b;

			te[2] = -a * d;
			te[6] = b;
			te[10] = a * c;
		} else if (euler.order === EulerOrder.ZYX) {
			let ae = a * e,
				af = a * f,
				be = b * e,
				bf = b * f;

			te[0] = c * e;
			te[4] = be * d - af;
			te[8] = ae * d + bf;

			te[1] = c * f;
			te[5] = bf * d + ae;
			te[9] = af * d - be;

			te[2] = -d;
			te[6] = b * c;
			te[10] = a * c;
		} else if (euler.order === EulerOrder.YZX) {
			let ac = a * c,
				ad = a * d,
				bc = b * c,
				bd = b * d;

			te[0] = c * e;
			te[4] = bd - ac * f;
			te[8] = bc * f + ad;

			te[1] = f;
			te[5] = a * e;
			te[9] = -b * e;

			te[2] = -d * e;
			te[6] = ad * f + bc;
			te[10] = ac - bd * f;
		} else if (euler.order === EulerOrder.XZY) {
			let ac = a * c,
				ad = a * d,
				bc = b * c,
				bd = b * d;

			te[0] = c * e;
			te[4] = -f;
			te[8] = d * e;

			te[1] = ac * f + bd;
			te[5] = a * e;
			te[9] = ad * f - bc;

			te[2] = bc * f - ad;
			te[6] = b * e;
			te[10] = bd * f + ac;
		}

		// bottom row
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;

		// last column
		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;

		return this;
	}

	makeRotationFromQuaternion(q: Quaternion) {
		this.compose(new Vector3(), q, new Vector3(1, 1, 1));

		return this;
	}

	makeScale(s: Vector3) {
		this.set(s.x, 0, 0, 0, 0, s.y, 0, 0, 0, 0, s.z, 0, 0, 0, 0, 1);

		return this;
	}

	makeShear(x: number, y: number, z: number) {
		this.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);

		return this;
	}

	compose(position: Vector3, quaternion: Quaternion, scale: Vector3) {
		let te = this.elements;

		let x = quaternion.x,
			y = quaternion.y,
			z = quaternion.z,
			w = quaternion.w;
		let x2 = x + x,
			y2 = y + y,
			z2 = z + z;
		let xx = x * x2,
			xy = x * y2,
			xz = x * z2;
		let yy = y * y2,
			yz = y * z2,
			zz = z * z2;
		let wx = w * x2,
			wy = w * y2,
			wz = w * z2;

		let sx = scale.x,
			sy = scale.y,
			sz = scale.z;

		te[0] = (1 - (yy + zz)) * sx;
		te[1] = (xy + wz) * sx;
		te[2] = (xz - wy) * sx;
		te[3] = 0;

		te[4] = (xy - wz) * sy;
		te[5] = (1 - (xx + zz)) * sy;
		te[6] = (yz + wx) * sy;
		te[7] = 0;

		te[8] = (xz + wy) * sz;
		te[9] = (yz - wx) * sz;
		te[10] = (1 - (xx + yy)) * sz;
		te[11] = 0;

		te[12] = position.x;
		te[13] = position.y;
		te[14] = position.z;
		te[15] = 1;

		return this;
	}

	decompose(position: Vector3, quaternion: Quaternion, scale: Vector3) {
		let te = this.elements;

		let sx = new Vector3(te[0], te[1], te[2]).length();
		let sy = new Vector3(te[4], te[5], te[6]).length();
		let sz = new Vector3(te[8], te[9], te[10]).length();

		// if determine is negative, we need to invert one scale
		if (this.determinant() < 0) sx = -sx;

		position.x = te[12];
		position.y = te[13];
		position.z = te[14];

		// scale the rotation part
		let m = new Matrix4().copy(this);

		let invSX = 1 / sx;
		let invSY = 1 / sy;
		let invSZ = 1 / sz;

		m.elements[0] *= invSX;
		m.elements[1] *= invSX;
		m.elements[2] *= invSX;

		m.elements[4] *= invSY;
		m.elements[5] *= invSY;
		m.elements[6] *= invSY;

		m.elements[8] *= invSZ;
		m.elements[9] *= invSZ;
		m.elements[10] *= invSZ;

		quaternion.setFromRotationMatrix4(m);

		scale.x = sx;
		scale.y = sy;
		scale.z = sz;

		return this;
	}

	// TODO: Replace with a Box2
	makePerspectiveProjection(
		left: number,
		right: number,
		top: number,
		bottom: number,
		near: number,
		far: number,
	) {
		let te = this.elements;
		let x = (2 * near) / (right - left);
		let y = (2 * near) / (top - bottom);

		let a = (right + left) / (right - left);
		let b = (top + bottom) / (top - bottom);
		let c = -(far + near) / (far - near);
		let d = (-2 * far * near) / (far - near);

		te[0] = x;
		te[4] = 0;
		te[8] = a;
		te[12] = 0;
		te[1] = 0;
		te[5] = y;
		te[9] = b;
		te[13] = 0;
		te[2] = 0;
		te[6] = 0;
		te[10] = c;
		te[14] = d;
		te[3] = 0;
		te[7] = 0;
		te[11] = -1;
		te[15] = 0;

		return this;
	}

	// TODO: Replace with a Box3?
	makeOrthographicProjection(
		left: number,
		right: number,
		top: number,
		bottom: number,
		near: number,
		far: number,
	) {
		let te = this.elements;
		let w = 1.0 / (right - left);
		let h = 1.0 / (top - bottom);
		let p = 1.0 / (far - near);

		let x = (right + left) * w;
		let y = (top + bottom) * h;
		let z = (far + near) * p;

		te[0] = 2 * w;
		te[4] = 0;
		te[8] = 0;
		te[12] = -x;
		te[1] = 0;
		te[5] = 2 * h;
		te[9] = 0;
		te[13] = -y;
		te[2] = 0;
		te[6] = 0;
		te[10] = -2 * p;
		te[14] = -z;
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;
		te[15] = 1;

		return this;
	}

	equals(m: Matrix4) {
		for (let i = 0; i < 16; i++) {
			if (m.elements[i] !== this.elements[i]) return false;
		}

		return true;
	}
}
