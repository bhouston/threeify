(function () {
    'use strict';

    const arrayBuffer = new ArrayBuffer(12 * 16);
    const floatArray = new Float32Array(arrayBuffer);
    const intArray = new Int32Array(arrayBuffer);
    function hashFloat2(v0, v1) {
        floatArray[0] = v0;
        floatArray[1] = v1;
        const hash = intArray[0];
        return (hash * 397) ^ intArray[1];
    }
    function hashFloat3(v0, v1, v2) {
        floatArray[0] = v0;
        floatArray[1] = v1;
        floatArray[2] = v2;
        let hash = intArray[0] | 0;
        hash = (hash * 397) ^ (intArray[1] | 0);
        return (hash * 397) ^ (intArray[2] | 0);
    }
    function hashFloat4(v0, v1, v2, v3) {
        floatArray[0] = v0;
        floatArray[1] = v1;
        floatArray[2] = v2;
        floatArray[3] = v3;
        let hash = intArray[0] | 0;
        hash = (hash * 397) ^ (intArray[1] | 0);
        hash = (hash * 397) ^ (intArray[2] | 0);
        return (hash * 397) ^ (intArray[3] | 0);
    }
    function hashFloatArray(elements) {
        for (let i = 0; i < elements.length; i++) {
            floatArray[i] = elements[i];
        }
        let hash = intArray[0] | 0;
        for (let i = 1; i < 16; i++) {
            hash = (hash * 397) ^ (intArray[i] | 0);
        }
        return hash;
    }

    var EulerOrder;
    (function (EulerOrder) {
        EulerOrder[EulerOrder["XYZ"] = 0] = "XYZ";
        EulerOrder[EulerOrder["YXZ"] = 1] = "YXZ";
        EulerOrder[EulerOrder["ZXY"] = 2] = "ZXY";
        EulerOrder[EulerOrder["ZYX"] = 3] = "ZYX";
        EulerOrder[EulerOrder["YZX"] = 4] = "YZX";
        EulerOrder[EulerOrder["XZY"] = 5] = "XZY";
        EulerOrder[EulerOrder["Default"] = 0] = "Default";
    })(EulerOrder || (EulerOrder = {}));
    class Euler {
        constructor(x = 0, y = 0, z = 0, order = EulerOrder.Default) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.order = order;
        }
        getHashCode() {
            return hashFloat4(this.x, this.y, this.z, this.order);
        }
        set(x, y, z, order = EulerOrder.Default) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.order = order;
            return this;
        }
        clone() {
            return new Euler().copy(this);
        }
        copy(e) {
            return this.set(e.x, e.y, e.z, e.order);
        }
        equals(e) {
            return e.x === this.x && e.y === this.y && e.z === this.z && e.order === this.order;
        }
        setFromArray(array, offset) {
            this.x = array[offset + 0];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            this.order = array[offset + 3];
        }
        toArray(array, offset) {
            array[offset + 0] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
            array[offset + 3] = this.order;
        }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function isPow2(value) {
        return (value & (value - 1)) === 0 && value !== 0;
    }

    class Quaternion {
        constructor(x = 0, y = 0, z = 0, w = 1) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        getHashCode() {
            return hashFloat4(this.x, this.y, this.z, this.w);
        }
        set(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        }
        clone() {
            return new Quaternion().copy(this);
        }
        copy(q) {
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
            this.w = q.w;
            return this;
        }
        add(q) {
            this.x += q.x;
            this.y += q.y;
            this.z += q.z;
            this.w += q.w;
            return this;
        }
        sub(q) {
            this.x -= q.x;
            this.y -= q.y;
            this.z -= q.z;
            this.w -= q.w;
            return this;
        }
        getComponent(index) {
            switch (index) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                case 3:
                    return this.w;
                default:
                    throw new Error(`index of our range: ${index}`);
            }
        }
        setComponent(index, value) {
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
                case 3:
                    this.w = value;
                    break;
                default:
                    throw new Error(`index of our range: ${index}`);
            }
            return this;
        }
        multiply(q) {
            const qax = this.x, qay = this.y, qaz = this.z, qaw = this.w;
            const qbx = q.x, qby = q.y, qbz = q.z, qbw = q.w;
            this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
            return this;
        }
        angleTo(q) {
            return 2 * Math.acos(Math.abs(Math.min(Math.max(this.dot(q), -1), 1)));
        }
        dot(q) {
            return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
        }
        conjugate() {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
            return this;
        }
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        }
        normalize() {
            let l = this.length();
            if (l === 0) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 1;
            }
            else {
                l = 1 / l;
                this.x *= l;
                this.y *= l;
                this.z *= l;
                this.w *= l;
            }
            return this;
        }
        slerp(qb, t) {
            if (t === 0) {
                return this;
            }
            if (t === 1) {
                return this.copy(qb);
            }
            const x = this.x, y = this.y, z = this.z, w = this.w;
            let cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
            if (cosHalfTheta < 0) {
                this.w = -qb.w;
                this.x = -qb.x;
                this.y = -qb.y;
                this.z = -qb.z;
                cosHalfTheta = -cosHalfTheta;
            }
            else {
                this.copy(qb);
            }
            if (cosHalfTheta >= 1.0) {
                this.w = w;
                this.x = x;
                this.y = y;
                this.z = z;
                return this;
            }
            const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;
            if (sqrSinHalfTheta <= Number.EPSILON) {
                const s = 1 - t;
                this.w = s * w + t * this.w;
                this.x = s * x + t * this.x;
                this.y = s * y + t * this.y;
                this.z = s * z + t * this.z;
                this.normalize();
                return this;
            }
            const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
            const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
            this.w = w * ratioA + this.w * ratioB;
            this.x = x * ratioA + this.x * ratioB;
            this.y = y * ratioA + this.y * ratioB;
            this.z = z * ratioA + this.z * ratioB;
            return this;
        }
        equals(q) {
            return q.x === this.x && q.y === this.y && q.z === this.z && q.w === this.w;
        }
        setFromArray(floatArray, offset) {
            this.x = floatArray[offset + 0];
            this.y = floatArray[offset + 1];
            this.z = floatArray[offset + 2];
            this.w = floatArray[offset + 3];
        }
        toArray(floatArray, offset) {
            floatArray[offset + 0] = this.x;
            floatArray[offset + 1] = this.y;
            floatArray[offset + 2] = this.z;
            floatArray[offset + 3] = this.w;
        }
    }

    function makeQuaternionFromEuler(e, result = new Quaternion()) {
        const x = e.x, y = e.y, z = e.z, order = e.order;
        const c1 = Math.cos(x / 2);
        const c2 = Math.cos(y / 2);
        const c3 = Math.cos(z / 2);
        const s1 = Math.sin(x / 2);
        const s2 = Math.sin(y / 2);
        const s3 = Math.sin(z / 2);
        switch (order) {
            case EulerOrder.XYZ:
                return result.set(s1 * c2 * c3 + c1 * s2 * s3, c1 * s2 * c3 - s1 * c2 * s3, c1 * c2 * s3 + s1 * s2 * c3, c1 * c2 * c3 - s1 * s2 * s3);
            case EulerOrder.YXZ:
                return result.set(s1 * c2 * c3 + c1 * s2 * s3, c1 * s2 * c3 - s1 * c2 * s3, c1 * c2 * s3 - s1 * s2 * c3, c1 * c2 * c3 + s1 * s2 * s3);
            case EulerOrder.ZXY:
                return result.set(s1 * c2 * c3 - c1 * s2 * s3, c1 * s2 * c3 + s1 * c2 * s3, c1 * c2 * s3 + s1 * s2 * c3, c1 * c2 * c3 - s1 * s2 * s3);
            case EulerOrder.ZYX:
                return result.set(s1 * c2 * c3 - c1 * s2 * s3, c1 * s2 * c3 + s1 * c2 * s3, c1 * c2 * s3 - s1 * s2 * c3, c1 * c2 * c3 + s1 * s2 * s3);
            case EulerOrder.YZX:
                return result.set(s1 * c2 * c3 + c1 * s2 * s3, c1 * s2 * c3 + s1 * c2 * s3, c1 * c2 * s3 - s1 * s2 * c3, c1 * c2 * c3 - s1 * s2 * s3);
            case EulerOrder.XZY:
                return result.set(s1 * c2 * c3 - c1 * s2 * s3, c1 * s2 * c3 - s1 * c2 * s3, c1 * c2 * s3 + s1 * s2 * c3, c1 * c2 * c3 + s1 * s2 * s3);
            default:
                throw new Error("unsupported euler order");
        }
    }

    class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        get width() {
            return this.x;
        }
        set width(width) {
            this.x = width;
        }
        get height() {
            return this.y;
        }
        set height(height) {
            this.y = height;
        }
        get depth() {
            return this.z;
        }
        set depth(depth) {
            this.z = depth;
        }
        get r() {
            return this.x;
        }
        set r(r) {
            this.x = r;
        }
        get g() {
            return this.y;
        }
        set g(g) {
            this.y = g;
        }
        get b() {
            return this.z;
        }
        set b(b) {
            this.z = b;
        }
        getHashCode() {
            return hashFloat3(this.x, this.y, this.z);
        }
        set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }
        clone() {
            return new Vector3().copy(this);
        }
        copy(v) {
            return this.set(v.x, v.y, v.z);
        }
        add(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        }
        addScalar(s) {
            this.x += s;
            this.y += s;
            this.z += s;
            return this;
        }
        sub(v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        }
        multiplyByScalar(s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
            return this;
        }
        negate() {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
            return this;
        }
        lerp(v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            return this;
        }
        normalize() {
            const length = this.length();
            return this.multiplyByScalar(length === 0 ? 1 : 1 / length);
        }
        getComponent(index) {
            if (index === 0) {
                return this.x;
            }
            else if (index === 1) {
                return this.y;
            }
            else if (index === 2) {
                return this.z;
            }
            else {
                throw new Error(`index of our range: ${index}`);
            }
        }
        setComponent(index, value) {
            if (index === 0) {
                this.x = value;
            }
            else if (index === 1) {
                this.y = value;
            }
            else if (index === 2) {
                this.z = value;
            }
            else {
                throw new Error(`index of our range: ${index}`);
            }
            return this;
        }
        dot(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        }
        cross(v) {
            const ax = this.x, ay = this.y, az = this.z;
            const bx = v.x, by = v.y, bz = v.z;
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            return this;
        }
        length() {
            return Math.sqrt(this.lengthSquared());
        }
        lengthSquared() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        }
        distanceToSquared(v) {
            const dx = this.x - v.x;
            const dy = this.y - v.y;
            const dz = this.z - v.z;
            return dx * dx + dy * dy + dz * dz;
        }
        distanceTo(v) {
            return Math.sqrt(this.distanceToSquared(v));
        }
        min(v) {
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);
            this.z = Math.min(this.z, v.z);
            return this;
        }
        max(v) {
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);
            this.z = Math.max(this.z, v.z);
            return this;
        }
        clamp(min, max) {
            this.x = clamp(this.x, min.x, max.x);
            this.y = clamp(this.y, min.y, max.y);
            this.z = clamp(this.z, min.z, max.z);
            return this;
        }
        equals(v) {
            return v.x === this.x && v.y === this.y && v.z === this.z;
        }
        setFromArray(array, offset) {
            this.x = array[offset + 0];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
        }
        toArray(array, offset) {
            array[offset + 0] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
        }
    }

    class Vector2 {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        get width() {
            return this.x;
        }
        set width(width) {
            this.x = width;
        }
        get height() {
            return this.y;
        }
        set height(height) {
            this.y = height;
        }
        getHashCode() {
            return hashFloat2(this.x, this.y);
        }
        set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
        clone() {
            return new Vector2().copy(this);
        }
        copy(v) {
            return this.set(v.x, v.y);
        }
        add(v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        }
        addScalar(s) {
            this.x += s;
            this.y += s;
            return this;
        }
        sub(v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }
        multiplyByScalar(s) {
            this.x *= s;
            this.y *= s;
            return this;
        }
        negate() {
            this.x *= -1;
            this.y *= -1;
            return this;
        }
        normalize() {
            const length = this.length();
            return this.multiplyByScalar(length === 0 ? 1 : 0);
        }
        getComponent(index) {
            if (index === 0) {
                return this.x;
            }
            else if (index === 1) {
                return this.y;
            }
            else {
                throw new Error(`index of our range: ${index}`);
            }
        }
        setComponent(index, value) {
            if (index === 0) {
                this.x = value;
            }
            else if (index === 1) {
                this.y = value;
            }
            else {
                throw new Error(`index of our range: ${index}`);
            }
            return this;
        }
        dot(v) {
            return this.x * v.x + this.y * v.y;
        }
        length() {
            return Math.sqrt(this.lengthSquared());
        }
        lengthSquared() {
            return this.x * this.x + this.y * this.y;
        }
        min(v) {
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);
            return this;
        }
        max(v) {
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);
            return this;
        }
        clamp(min, max) {
            this.x = clamp(this.x, min.x, max.x);
            this.y = clamp(this.y, min.y, max.y);
            return this;
        }
        equals(v) {
            return v.x === this.x && v.y === this.y;
        }
        setFromArray(array, offset) {
            this.x = array[offset + 0];
            this.y = array[offset + 1];
        }
        toArray(array, offset) {
            array[offset + 0] = this.x;
            array[offset + 1] = this.y;
        }
    }

    class Orbit {
        constructor(domElement) {
            this.domElement = domElement;
            this.lastPointerClient = new Vector2();
            this.orientation = new Quaternion();
            this.disposed = false;
            this.euler = new Euler();
            this.eulerMomentum = new Euler();
            this.zoom = 0;
            this.zoomMomentum = 0;
            this.damping = 0.1;
            this.onPointerDownHandler = this.onPointerDown.bind(this);
            this.onPointerCancelHandler = this.onPointerCancel.bind(this);
            this.onPointerUpHandler = this.onPointerUp.bind(this);
            this.onPointerMoveHandler = this.onPointerMove.bind(this);
            this.onMouseWheelHandler = this.onMouseWheel.bind(this);
            this.domElement.style.touchAction = 'none';
            this.domElement.addEventListener('pointerdown', this.onPointerDownHandler, false);
            this.domElement.addEventListener('pointercancel', this.onPointerCancelHandler, false);
            this.domElement.addEventListener('wheel', this.onMouseWheelHandler, false);
        }
        dispose() {
            if (!this.disposed) {
                this.disposed = true;
                this.domElement.removeEventListener('pointerdown', this.onPointerDownHandler);
                this.domElement.removeEventListener('pointercancel', this.onPointerCancelHandler);
            }
        }
        onPointerDown(pe) {
            this.domElement.setPointerCapture(pe.pointerId);
            this.domElement.addEventListener('pointermove', this.onPointerMoveHandler, false);
            this.domElement.addEventListener('pointerup', this.onPointerUpHandler, false);
            this.lastPointerClient.set(pe.clientX, pe.clientY);
        }
        onPointerUp(pe) {
            this.domElement.releasePointerCapture(pe.pointerId);
            this.domElement.removeEventListener('pointermove', this.onPointerMoveHandler);
            this.domElement.removeEventListener('pointerup', this.onPointerUpHandler);
        }
        onMouseWheel(we) {
            this.zoomMomentum += we.deltaY * this.damping * 0.002;
        }
        onPointerMove(pe) {
            const pointerClient = new Vector2(pe.clientX, pe.clientY);
            const pointerClientDelta = pointerClient.clone().sub(this.lastPointerClient);
            pointerClientDelta.x /= this.domElement.clientWidth;
            pointerClientDelta.y /= this.domElement.clientHeight;
            this.eulerMomentum.x += (pointerClientDelta.y * Math.PI) * this.damping;
            this.eulerMomentum.y += (pointerClientDelta.x * Math.PI) * this.damping;
            this.lastPointerClient.copy(pointerClient);
        }
        update() {
            this.euler.x += this.eulerMomentum.x;
            this.euler.y += this.eulerMomentum.y;
            this.eulerMomentum.x *= (1 - this.damping);
            this.eulerMomentum.y *= (1 - this.damping);
            this.orientation = makeQuaternionFromEuler(this.euler, this.orientation);
            this.zoom += this.zoomMomentum;
            this.zoomMomentum *= (1 - this.damping);
            this.zoom = Math.min(1, Math.max(0, this.zoom));
        }
        onPointerCancel(pe) {
        }
    }

    const _lut = [];
    for (let i = 0; i < 256; i++) {
        _lut[i] = (i < 16 ? "0" : "") + i.toString(16);
    }
    function generateUUID() {
        const d0 = (Math.random() * 0x100000000) | 0;
        const d1 = (Math.random() * 0x100000000) | 0;
        const d2 = (Math.random() * 0x100000000) | 0;
        const d3 = (Math.random() * 0x100000000) | 0;
        const uuid = _lut[d0 & 0xff] +
            _lut[(d0 >> 8) & 0xff] +
            _lut[(d0 >> 16) & 0xff] +
            _lut[(d0 >> 24) & 0xff] +
            "-" +
            _lut[d1 & 0xff] +
            _lut[(d1 >> 8) & 0xff] +
            "-" +
            _lut[((d1 >> 16) & 0x0f) | 0x40] +
            _lut[(d1 >> 24) & 0xff] +
            "-" +
            _lut[(d2 & 0x3f) | 0x80] +
            _lut[(d2 >> 8) & 0xff] +
            "-" +
            _lut[(d2 >> 16) & 0xff] +
            _lut[(d2 >> 24) & 0xff] +
            _lut[d3 & 0xff] +
            _lut[(d3 >> 8) & 0xff] +
            _lut[(d3 >> 16) & 0xff] +
            _lut[(d3 >> 24) & 0xff];
        return uuid.toUpperCase();
    }

    class Matrix3 {
        constructor() {
            this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        }
        getHashCode() {
            return hashFloatArray(this.elements);
        }
        set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
            const te = this.elements;
            te[0] = n11;
            te[1] = n21;
            te[2] = n31;
            te[3] = n12;
            te[4] = n22;
            te[5] = n32;
            te[6] = n13;
            te[7] = n23;
            te[8] = n33;
            return this;
        }
        clone() {
            return new Matrix3().copy(this);
        }
        copy(m) {
            const te = this.elements;
            const me = m.elements;
            te[0] = me[0];
            te[1] = me[1];
            te[2] = me[2];
            te[3] = me[3];
            te[4] = me[4];
            te[5] = me[5];
            te[6] = me[6];
            te[7] = me[7];
            te[8] = me[8];
            return this;
        }
        getComponent(index) {
            return this.elements[index];
        }
        setComponent(index, value) {
            this.elements[index] = value;
            return this;
        }
        multiplyByScalar(s) {
            const te = this.elements;
            te[0] *= s;
            te[3] *= s;
            te[6] *= s;
            te[1] *= s;
            te[4] *= s;
            te[7] *= s;
            te[2] *= s;
            te[5] *= s;
            te[8] *= s;
            return this;
        }
        makeIdentity() {
            this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
            return this;
        }
        equals(m) {
            for (let i = 0; i < 16; i++) {
                if (m.elements[i] !== this.elements[i]) {
                    return false;
                }
            }
            return true;
        }
        setFromArray(floatArray, offset) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i] = floatArray[offset + i];
            }
        }
        toArray(floatArray, offset) {
            for (let i = 0; i < this.elements.length; i++) {
                floatArray[offset + i] = this.elements[i];
            }
        }
    }

    class Matrix4 {
        constructor() {
            this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }
        getHashCode() {
            return hashFloatArray(this.elements);
        }
        set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
            const te = this.elements;
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
        copy(m) {
            const me = m.elements;
            return this.set(me[0], me[4], me[8], me[12], me[1], me[5], me[9], me[13], me[2], me[6], me[10], me[14], me[3], me[7], me[11], me[15]);
        }
        getComponent(index) {
            return this.elements[index];
        }
        setComponent(index, value) {
            this.elements[index] = value;
            return this;
        }
        multiplyByScalar(s) {
            const te = this.elements;
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
        makeIdentity() {
            return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        equals(m) {
            for (let i = 0; i < 16; i++) {
                if (m.elements[i] !== this.elements[i]) {
                    return false;
                }
            }
            return true;
        }
        setFromArray(array, offset) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i] = array[offset + i];
            }
        }
        toArray(array, offset) {
            for (let i = 0; i < this.elements.length; i++) {
                array[offset + i] = this.elements[i];
            }
        }
    }

    function makeMatrix4Inverse(m, result = new Matrix4()) {
        const me = m.elements, n11 = me[0], n21 = me[1], n31 = me[2], n41 = me[3], n12 = me[4], n22 = me[5], n32 = me[6], n42 = me[7], n13 = me[8], n23 = me[9], n33 = me[10], n43 = me[11], n14 = me[12], n24 = me[13], n34 = me[14], n44 = me[15], t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44, t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44, t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44, t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
        const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
        if (det === 0) {
            throw new Error("can not invert degenerate matrix");
        }
        const detInv = 1 / det;
        const re = result.elements;
        re[0] = t11 * detInv;
        re[1] =
            (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) *
                detInv;
        re[2] =
            (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) *
                detInv;
        re[3] =
            (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) *
                detInv;
        re[4] = t12 * detInv;
        re[5] =
            (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) *
                detInv;
        re[6] =
            (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) *
                detInv;
        re[7] =
            (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) *
                detInv;
        re[8] = t13 * detInv;
        re[9] =
            (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) *
                detInv;
        re[10] =
            (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) *
                detInv;
        re[11] =
            (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) *
                detInv;
        re[12] = t14 * detInv;
        re[13] =
            (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) *
                detInv;
        re[14] =
            (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) *
                detInv;
        re[15] =
            (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) *
                detInv;
        return result;
    }
    function makeMatrix4RotationFromQuaternion(q, result = new Matrix4()) {
        return composeMatrix4(new Vector3(), q, new Vector3(1, 1, 1), result);
    }
    function composeMatrix4(position, rotation, scale, result = new Matrix4()) {
        const x = rotation.x, y = rotation.y, z = rotation.z, w = rotation.w;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        const sx = scale.x, sy = scale.y, sz = scale.z;
        return result.set((1 - (yy + zz)) * sx, (xy - wz) * sy, (xz + wy) * sz, position.x, (xy + wz) * sx, (1 - (xx + zz)) * sy, (yz - wx) * sz, position.y, (xz - wy) * sx, (yz + wx) * sy, (1 - (xx + yy)) * sz, position.z, 0, 0, 0, 1);
    }
    function makeMatrix4Perspective(left, right, top, bottom, near, far, result = new Matrix4()) {
        const x = (2 * near) / (right - left);
        const y = (2 * near) / (top - bottom);
        const a = (right + left) / (right - left);
        const b = (top + bottom) / (top - bottom);
        const c = -(far + near) / (far - near);
        const d = (-2 * far * near) / (far - near);
        return result.set(x, 0, a, 0, 0, y, b, 0, 0, 0, c, d, 0, 0, -1, 0);
    }
    function makeMatrix4PerspectiveFov(verticalFov, near, far, zoom, aspectRatio, result = new Matrix4()) {
        const height = (2.0 * near * Math.tan((verticalFov * Math.PI) / 180.0)) / zoom;
        const width = height * aspectRatio;
        const right = width * 0.5;
        const left = right - width;
        const top = height * 0.5;
        const bottom = top - height;
        return makeMatrix4Perspective(left, right, top, bottom, near, far, result);
    }

    const GL = WebGLRenderingContext;

    var ComponentType;
    (function (ComponentType) {
        ComponentType[ComponentType["Byte"] = GL.BYTE] = "Byte";
        ComponentType[ComponentType["UnsignedByte"] = GL.UNSIGNED_BYTE] = "UnsignedByte";
        ComponentType[ComponentType["Short"] = GL.SHORT] = "Short";
        ComponentType[ComponentType["UnsignedShort"] = GL.UNSIGNED_SHORT] = "UnsignedShort";
        ComponentType[ComponentType["Int"] = GL.INT] = "Int";
        ComponentType[ComponentType["UnsignedInt"] = GL.UNSIGNED_INT] = "UnsignedInt";
        ComponentType[ComponentType["Float"] = GL.FLOAT] = "Float";
    })(ComponentType || (ComponentType = {}));
    function componentTypeSizeOf(componentType) {
        switch (componentType) {
            case ComponentType.Byte:
            case ComponentType.UnsignedByte:
                return 1;
            case ComponentType.Short:
            case ComponentType.UnsignedShort:
                return 2;
            case ComponentType.Float:
            case ComponentType.Int:
            case ComponentType.UnsignedInt:
                return 4;
        }
        throw new Error(`unsupported component type: ${componentType}`);
    }

    var BufferTarget;
    (function (BufferTarget) {
        BufferTarget[BufferTarget["Array"] = GL.ARRAY_BUFFER] = "Array";
        BufferTarget[BufferTarget["ElementArray"] = GL.ELEMENT_ARRAY_BUFFER] = "ElementArray";
    })(BufferTarget || (BufferTarget = {}));

    class AttributeData {
        constructor(arrayBuffer, target = BufferTarget.Array) {
            this.arrayBuffer = arrayBuffer;
            this.target = target;
            this.disposed = false;
            this.uuid = generateUUID();
            this.version = 0;
        }
        dirty() {
            this.version++;
        }
        dispose() {
            if (!this.disposed) {
                this.disposed = true;
                this.dirty();
            }
        }
    }

    class Attribute {
        constructor(attributeData, componentsPerVertex, componentType, vertexStride, byteOffset, normalized) {
            this.attributeData = attributeData;
            this.componentsPerVertex = componentsPerVertex;
            this.componentType = componentType;
            this.vertexStride = vertexStride;
            this.byteOffset = byteOffset;
            this.normalized = normalized;
            this.bytesPerComponent = componentTypeSizeOf(this.componentType);
            this.bytesPerVertex = this.bytesPerComponent * this.componentsPerVertex;
            if (this.vertexStride < 0) {
                this.vertexStride = this.bytesPerVertex;
            }
            this.count = this.attributeData.arrayBuffer.byteLength / this.vertexStride;
        }
    }
    function makeUint32Attribute(array, componentsPerVertex = 1, normalized = false) {
        return new Attribute(new AttributeData((array instanceof Uint32Array ? array : new Uint32Array(array)).buffer), componentsPerVertex, ComponentType.UnsignedInt, -1, 0, normalized);
    }
    function makeFloat32Attribute(array, componentsPerVertex = 1, normalized = false) {
        return new Attribute(new AttributeData((array instanceof Float32Array ? array : new Float32Array(array)).buffer), componentsPerVertex, ComponentType.Float, -1, 0, normalized);
    }

    var PrimitiveType;
    (function (PrimitiveType) {
        PrimitiveType[PrimitiveType["Points"] = GL.POINTS] = "Points";
        PrimitiveType[PrimitiveType["Lines"] = GL.LINES] = "Lines";
        PrimitiveType[PrimitiveType["LineStrip"] = GL.LINE_STRIP] = "LineStrip";
        PrimitiveType[PrimitiveType["Triangles"] = GL.TRIANGLES] = "Triangles";
        PrimitiveType[PrimitiveType["TriangleFan"] = GL.TRIANGLE_FAN] = "TriangleFan";
        PrimitiveType[PrimitiveType["TriangleStrip"] = GL.TRIANGLE_STRIP] = "TriangleStrip";
    })(PrimitiveType || (PrimitiveType = {}));

    class Geometry {
        constructor() {
            this.disposed = false;
            this.version = 0;
            this.indices = undefined;
            this.attributes = {};
            this.primitive = PrimitiveType.Triangles;
        }
        dirty() {
            this.version++;
        }
        dispose() {
            if (!this.disposed) {
                for (const name in this.attributes) {
                    const attribute = this.attributes[name];
                    if (attribute !== undefined) {
                        attribute.attributeData.dispose();
                    }
                }
                this.disposed = true;
                this.dirty();
            }
        }
    }

    var Blending;
    (function (Blending) {
        Blending[Blending["Over"] = 0] = "Over";
        Blending[Blending["Add"] = 1] = "Add";
        Blending[Blending["Subtract"] = 2] = "Subtract";
        Blending[Blending["Multiply"] = 3] = "Multiply";
    })(Blending || (Blending = {}));

    class ShaderMaterial {
        constructor(vertexShaderCode, fragmentShaderCode, glslVersion = 200) {
            this.vertexShaderCode = vertexShaderCode;
            this.fragmentShaderCode = fragmentShaderCode;
            this.glslVersion = glslVersion;
            this.uuid = generateUUID();
            this.version = 0;
            this.disposed = false;
            this.name = "";
        }
        dirty() {
            this.version++;
        }
        dispose() {
            this.disposed = true;
            this.dirty();
        }
    }

    var BlendEquation;
    (function (BlendEquation) {
        BlendEquation[BlendEquation["Add"] = GL.FUNC_ADD] = "Add";
        BlendEquation[BlendEquation["Subtract"] = GL.FUNC_SUBTRACT] = "Subtract";
        BlendEquation[BlendEquation["ReverseSubtract"] = GL.FUNC_REVERSE_SUBTRACT] = "ReverseSubtract";
    })(BlendEquation || (BlendEquation = {}));
    var BlendFunc;
    (function (BlendFunc) {
        BlendFunc[BlendFunc["Zero"] = GL.ZERO] = "Zero";
        BlendFunc[BlendFunc["One"] = GL.ONE] = "One";
        BlendFunc[BlendFunc["SourceColor"] = GL.SRC_COLOR] = "SourceColor";
        BlendFunc[BlendFunc["OneMinusSourceColor"] = GL.ONE_MINUS_SRC_COLOR] = "OneMinusSourceColor";
        BlendFunc[BlendFunc["DestColor"] = GL.DST_COLOR] = "DestColor";
        BlendFunc[BlendFunc["OneMinusDestColor"] = GL.ONE_MINUS_DST_COLOR] = "OneMinusDestColor";
        BlendFunc[BlendFunc["SourceAlpha"] = GL.SRC_ALPHA] = "SourceAlpha";
        BlendFunc[BlendFunc["OneMinusSourceAlpha"] = GL.ONE_MINUS_SRC_ALPHA] = "OneMinusSourceAlpha";
        BlendFunc[BlendFunc["DestAlpha"] = GL.DST_ALPHA] = "DestAlpha";
        BlendFunc[BlendFunc["OneMinusDestAlpha"] = GL.ONE_MINUS_DST_ALPHA] = "OneMinusDestAlpha";
        BlendFunc[BlendFunc["ConstantColor"] = GL.CONSTANT_COLOR] = "ConstantColor";
        BlendFunc[BlendFunc["OneMinusConstantColor"] = GL.ONE_MINUS_CONSTANT_COLOR] = "OneMinusConstantColor";
        BlendFunc[BlendFunc["ConstantAlpha"] = GL.CONSTANT_ALPHA] = "ConstantAlpha";
        BlendFunc[BlendFunc["OneMinusConstantAlpha"] = GL.ONE_MINUS_CONSTANT_ALPHA] = "OneMinusConstantAlpha";
        BlendFunc[BlendFunc["SourceAlphaSaturate"] = GL.SRC_ALPHA_SATURATE] = "SourceAlphaSaturate";
    })(BlendFunc || (BlendFunc = {}));
    class BlendState {
        constructor(sourceRGBFactor = BlendFunc.One, destRGBFactor = BlendFunc.Zero, sourceAlphaFactor = BlendFunc.One, destAlphaFactor = BlendFunc.Zero, equation = BlendEquation.Add) {
            this.sourceRGBFactor = sourceRGBFactor;
            this.destRGBFactor = destRGBFactor;
            this.sourceAlphaFactor = sourceAlphaFactor;
            this.destAlphaFactor = destAlphaFactor;
            this.equation = equation;
        }
        clone() {
            return new BlendState(this.sourceRGBFactor, this.destRGBFactor, this.sourceAlphaFactor, this.destAlphaFactor, this.equation);
        }
        copy(bs) {
            this.sourceRGBFactor = bs.sourceRGBFactor;
            this.destRGBFactor = bs.destRGBFactor;
            this.sourceAlphaFactor = bs.sourceAlphaFactor;
            this.destAlphaFactor = bs.destAlphaFactor;
            this.equation = bs.equation;
        }
        equals(bs) {
            return (this.sourceRGBFactor === bs.sourceRGBFactor &&
                this.destRGBFactor === bs.destRGBFactor &&
                this.sourceAlphaFactor === bs.sourceAlphaFactor &&
                this.destAlphaFactor === bs.destAlphaFactor &&
                this.equation === bs.equation);
        }
    }

    var BufferUsage;
    (function (BufferUsage) {
        BufferUsage[BufferUsage["StaticDraw"] = GL.STATIC_DRAW] = "StaticDraw";
        BufferUsage[BufferUsage["DynamicDraw"] = GL.DYNAMIC_DRAW] = "DynamicDraw";
    })(BufferUsage || (BufferUsage = {}));

    class Buffer {
        constructor(context, arrayBuffer, target = BufferTarget.Array, usage = BufferUsage.StaticDraw) {
            this.context = context;
            this.target = target;
            this.usage = usage;
            this.disposed = false;
            const gl = context.gl;
            {
                const glBuffer = gl.createBuffer();
                if (glBuffer === null) {
                    throw new Error("createBuffer failed");
                }
                this.glBuffer = glBuffer;
            }
            gl.bindBuffer(this.target, this.glBuffer);
            gl.bufferData(this.target, arrayBuffer, this.usage);
            this.id = this.context.registerResource(this);
        }
        update(arrayBuffer, target = BufferTarget.Array, usage = BufferUsage.StaticDraw) {
            this.target = target;
            this.usage = usage;
            const gl = this.context.gl;
            gl.bindBuffer(this.target, this.glBuffer);
            gl.bufferData(this.target, arrayBuffer, this.usage);
        }
        dispose() {
            if (!this.disposed) {
                this.context.gl.deleteBuffer(this.glBuffer);
                this.context.disposeResource(this);
                this.disposed = true;
            }
        }
    }

    class BufferAccessor {
        constructor(buffer, componentType, componentsPerVertex, normalized, vertexStride, byteOffset) {
            this.buffer = buffer;
            this.componentType = componentType;
            this.componentsPerVertex = componentsPerVertex;
            this.normalized = normalized;
            this.vertexStride = vertexStride;
            this.byteOffset = byteOffset;
        }
    }
    function makeBufferAccessorFromAttribute(context, attribute, bufferTarget = undefined) {
        const attributeData = attribute.attributeData;
        const target = bufferTarget !== undefined ? bufferTarget : attributeData.target;
        const buffer = new Buffer(context, attributeData.arrayBuffer, target);
        const bufferAccessor = new BufferAccessor(buffer, attribute.componentType, attribute.componentsPerVertex, attribute.normalized, attribute.vertexStride, attribute.byteOffset);
        return bufferAccessor;
    }

    class BufferGeometry {
        constructor(context) {
            this.context = context;
            this.disposed = false;
            this.bufferAccessors = {};
            this.indices = undefined;
            this.primitive = PrimitiveType.Triangles;
            this.count = -1;
        }
        dispose() {
            console.warn("This is not safe.  The buffers may be used by multiple bufferViews & bufferGeometries.");
            if (!this.disposed) {
                for (const name in this.bufferAccessors) {
                    const bufferAccessor = this.bufferAccessors[name];
                    if (bufferAccessor !== undefined) {
                        bufferAccessor.buffer.dispose();
                    }
                }
                if (this.indices !== undefined) {
                    this.indices.buffer.dispose();
                }
                this.disposed = true;
            }
        }
    }
    function makeBufferGeometryFromGeometry(context, geometry) {
        const bufferGeometry = new BufferGeometry(context);
        if (geometry.indices !== undefined) {
            bufferGeometry.indices = makeBufferAccessorFromAttribute(context, geometry.indices, BufferTarget.ElementArray);
            bufferGeometry.count = geometry.indices.count;
        }
        for (const name in geometry.attributes) {
            const attribute = geometry.attributes[name];
            if (attribute !== undefined) {
                bufferGeometry.bufferAccessors[name] = makeBufferAccessorFromAttribute(context, attribute);
                if (bufferGeometry.count === -1) {
                    bufferGeometry.count = attribute.count;
                }
            }
        }
        bufferGeometry.primitive = geometry.primitive;
        return bufferGeometry;
    }

    class ClearState {
        constructor(color = new Vector3(1, 1, 1), alpha = 0, depth = 1, stencil = 0) {
            this.color = color;
            this.alpha = alpha;
            this.depth = depth;
            this.stencil = stencil;
        }
        clone() {
            return new ClearState(this.color, this.alpha, this.depth, this.stencil);
        }
        copy(cs) {
            this.color.copy(cs.color);
            this.alpha = cs.alpha;
            this.depth = cs.depth;
            this.stencil = cs.stencil;
        }
        equals(cs) {
            return (this.color.equals(cs.color) && this.alpha === cs.alpha && this.depth === cs.depth && this.stencil === cs.stencil);
        }
    }

    var Attachment;
    (function (Attachment) {
        Attachment[Attachment["Color0"] = GL.COLOR_ATTACHMENT0] = "Color0";
        Attachment[Attachment["Depth"] = GL.DEPTH_ATTACHMENT] = "Depth";
        Attachment[Attachment["DepthStencil"] = GL.DEPTH_STENCIL_ATTACHMENT] = "DepthStencil";
        Attachment[Attachment["Stencil"] = GL.STENCIL_ATTACHMENT] = "Stencil";
    })(Attachment || (Attachment = {}));

    class Box2 {
        constructor(min = new Vector2(+Infinity, +Infinity), max = new Vector2(+Infinity, +Infinity)) {
            this.min = min;
            this.max = max;
        }
        get x() {
            return this.min.x;
        }
        get y() {
            return this.min.y;
        }
        get left() {
            return this.min.x;
        }
        get top() {
            return this.min.y;
        }
        get width() {
            return this.max.x - this.min.x;
        }
        get height() {
            return this.max.y - this.min.y;
        }
        get bottom() {
            return this.max.y;
        }
        get right() {
            return this.max.x;
        }
        getHashCode() {
            return hashFloat2(this.min.getHashCode(), this.max.getHashCode());
        }
        set(min, max) {
            this.min.copy(min);
            this.max.copy(max);
            return this;
        }
        clone() {
            return new Box2().copy(this);
        }
        copy(box) {
            this.min.copy(box.min);
            this.max.copy(box.max);
            return this;
        }
        getCenter(v) {
            return v.set((this.min.x + this.max.x) * 0.5, (this.min.y + this.max.y) * 0.5);
        }
        makeEmpty() {
            this.min.x = this.min.y = +Infinity;
            this.max.x = this.max.y = -Infinity;
            return this;
        }
        isEmpty() {
            return this.max.x < this.min.x || this.max.y < this.min.y;
        }
        union(box) {
            this.min.min(box.min);
            this.max.max(box.max);
            return this;
        }
        translate(offset) {
            this.min.add(offset);
            this.max.add(offset);
            return this;
        }
        equals(box) {
            return box.min.equals(this.min) && box.max.equals(this.max);
        }
    }

    var BufferBit;
    (function (BufferBit) {
        BufferBit[BufferBit["None"] = 0] = "None";
        BufferBit[BufferBit["Color"] = GL.COLOR_BUFFER_BIT] = "Color";
        BufferBit[BufferBit["Depth"] = GL.DEPTH_BUFFER_BIT] = "Depth";
        BufferBit[BufferBit["Stencil"] = GL.STENCIL_BUFFER_BIT] = "Stencil";
        BufferBit[BufferBit["Default"] = BufferBit.Color | BufferBit.Depth] = "Default";
        BufferBit[BufferBit["All"] = BufferBit.Color | BufferBit.Depth | BufferBit.Stencil] = "All";
    })(BufferBit || (BufferBit = {}));

    class VirtualFramebuffer {
        constructor(context) {
            this.context = context;
            this.disposed = false;
            this.cullingState = undefined;
            this.clearState = undefined;
            this.depthTestState = undefined;
            this.blendState = undefined;
            this.maskState = undefined;
            this.viewport = undefined;
        }
        clear(attachmentBits = BufferBit.Color | BufferBit.Depth, clearState = undefined) {
            var _a;
            this.context.framebuffer = this;
            this.context.clearState = (_a = clearState !== null && clearState !== void 0 ? clearState : this.clearState) !== null && _a !== void 0 ? _a : this.context.clearState;
            const gl = this.context.gl;
            gl.clear(attachmentBits);
        }
        render(node, camera, clear = false) {
            this.context.framebuffer = this;
            if (clear) {
                this.clear();
            }
            throw new Error("Not implemented");
        }
        flush() {
            this.context.gl.flush();
        }
        finish() {
            this.context.gl.finish();
        }
    }
    function renderBufferGeometry(framebuffer, program, uniforms, bufferGeometry, depthTestState = undefined, blendState = undefined, maskState = undefined, cullingState = undefined) {
        var _a, _b, _c, _d;
        const context = framebuffer.context;
        context.framebuffer = framebuffer;
        context.blendState = (_a = blendState !== null && blendState !== void 0 ? blendState : framebuffer.blendState) !== null && _a !== void 0 ? _a : context.blendState;
        context.depthTestState = (_b = depthTestState !== null && depthTestState !== void 0 ? depthTestState : framebuffer.depthTestState) !== null && _b !== void 0 ? _b : context.depthTestState;
        context.maskState = (_c = maskState !== null && maskState !== void 0 ? maskState : framebuffer.maskState) !== null && _c !== void 0 ? _c : context.maskState;
        context.cullingState = (_d = cullingState !== null && cullingState !== void 0 ? cullingState : framebuffer.cullingState) !== null && _d !== void 0 ? _d : context.cullingState;
        context.program = program;
        context.program.setUniformValues(uniforms);
        context.program.setAttributeBuffers(bufferGeometry);
        context.viewport = new Box2(new Vector2(), framebuffer.size);
        const gl = context.gl;
        if (bufferGeometry.indices !== undefined) {
            gl.drawElements(bufferGeometry.primitive, bufferGeometry.count, bufferGeometry.indices.componentType, 0);
        }
        else {
            gl.drawArrays(bufferGeometry.primitive, 0, bufferGeometry.count);
        }
    }

    var __classPrivateFieldGet$3 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var _size;
    class Framebuffer extends VirtualFramebuffer {
        constructor(context) {
            super(context);
            _size.set(this, new Vector2());
            this._attachments = {};
            const gl = this.context.gl;
            {
                const glFramebuffer = gl.createFramebuffer();
                if (glFramebuffer === null) {
                    throw new Error("createFramebuffer failed");
                }
                this.glFramebuffer = glFramebuffer;
            }
            this.id = this.context.registerResource(this);
        }
        attach(attachmentPoint, texImage2D, target = texImage2D.target, level = 0) {
            const gl = this.context.gl;
            gl.bindFramebuffer(GL.FRAMEBUFFER, this.glFramebuffer);
            gl.framebufferTexture2D(GL.FRAMEBUFFER, attachmentPoint, target, texImage2D.glTexture, level);
            this._attachments[attachmentPoint] = texImage2D;
            this.size.copy(texImage2D.size);
            gl.bindFramebuffer(GL.FRAMEBUFFER, null);
        }
        getAttachment(attachmentPoint) {
            return this._attachments[attachmentPoint];
        }
        get size() {
            return __classPrivateFieldGet$3(this, _size);
        }
        dispose() {
            if (!this.disposed) {
                const gl = this.context.gl;
                gl.deleteFramebuffer(this.glFramebuffer);
                this.context.disposeResource(this);
                this.disposed = true;
            }
        }
    }
    _size = new WeakMap();

    var ShaderType;
    (function (ShaderType) {
        ShaderType[ShaderType["Fragment"] = GL.FRAGMENT_SHADER] = "Fragment";
        ShaderType[ShaderType["Vertex"] = GL.VERTEX_SHADER] = "Vertex";
    })(ShaderType || (ShaderType = {}));

    var __classPrivateFieldGet$2 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var __classPrivateFieldSet$2 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    var _validated$1;
    function insertLineNumbers(source) {
        const inputLines = source.split("\n");
        const outputLines = ["\n"];
        const maxLineCharacters = Math.floor(Math.log10(inputLines.length));
        for (let l = 0; l < inputLines.length; l++) {
            const lAsString = `000000${l + 1}`.slice(-maxLineCharacters - 1);
            outputLines.push(`${lAsString}: ${inputLines[l]}`);
        }
        return outputLines.join("\n");
    }
    function removeDeadCode(source) {
        const defineRegexp = /^#define +([\w\d_]+)/;
        const undefRegexp = /^#undef +([\w\d_]+)/;
        const ifdefRegexp = /^#ifdef +([\w\d_]+)/;
        const ifndefRegexp = /^#ifndef +([\w\d_]+)/;
        const endifRegexp = /^#endif.* /;
        let defines = [];
        const liveCodeStack = [true];
        const outputLines = [];
        source.split("\n").forEach((line) => {
            const isLive = liveCodeStack[liveCodeStack.length - 1];
            if (isLive) {
                const defineMatch = line.match(defineRegexp);
                if (defineMatch !== null) {
                    defines.push(defineMatch[1]);
                }
                const undefMatch = line.match(undefRegexp);
                if (undefMatch !== null) {
                    const indexOfDefine = defines.indexOf(undefMatch[1]);
                    if (indexOfDefine >= 0) {
                        defines = defines.splice(indexOfDefine, 1);
                    }
                }
                const ifdefMatch = line.match(ifdefRegexp);
                if (ifdefMatch !== null) {
                    liveCodeStack.push(defines.indexOf(ifdefMatch[1]) >= 0);
                    return;
                }
                const ifndefMatch = line.match(ifndefRegexp);
                if (ifndefMatch !== null) {
                    liveCodeStack.push(defines.indexOf(ifndefMatch[1]) < 0);
                    return;
                }
            }
            const endifMatch = line.match(endifRegexp);
            if (endifMatch !== null) {
                liveCodeStack.pop();
                return;
            }
            if (isLive) {
                outputLines.push(line);
            }
        });
        return outputLines
            .join("\n")
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")
            .replace(/[\r\n]+/g, "\n");
    }
    class Shader {
        constructor(context, source, shaderType, glslVersion = 300) {
            this.context = context;
            this.source = source;
            this.shaderType = shaderType;
            this.glslVersion = glslVersion;
            this.disposed = false;
            _validated$1.set(this, false);
            const gl = this.context.gl;
            {
                const glShader = gl.createShader(shaderType);
                if (glShader === null) {
                    throw new Error("createShader failed");
                }
                this.glShader = glShader;
            }
            const prefix = [];
            if (glslVersion === 300) {
                prefix.push("#version 300 es");
            }
            if (shaderType === ShaderType.Fragment) {
                const glxo = context.glxo;
                if (glxo.EXT_shader_texture_lod !== null) {
                    prefix.push("#extension GL_EXT_shader_texture_lod : enable");
                }
                prefix.push("#extension GL_OES_standard_derivatives : enable");
            }
            const combinedSource = prefix.join("\n") + "\n" + source;
            this.finalSource = removeDeadCode(combinedSource);
            gl.shaderSource(this.glShader, this.finalSource);
            gl.compileShader(this.glShader);
            this.id = this.context.registerResource(this);
        }
        get translatedSource() {
            const ds = this.context.glxo.WEBGL_debug_shaders;
            if (ds !== null) {
                return ds.getTranslatedShaderSource(this.glShader);
            }
            return "";
        }
        validate() {
            if (__classPrivateFieldGet$2(this, _validated$1) || this.disposed) {
                return;
            }
            const gl = this.context.gl;
            const compileStatus = gl.getShaderParameter(this.glShader, GL.COMPILE_STATUS);
            if (!compileStatus) {
                const infoLog = gl.getShaderInfoLog(this.glShader);
                const errorMessage = `could not compile shader:\n${infoLog}`;
                console.error(errorMessage);
                console.error(insertLineNumbers(this.finalSource));
                this.disposed = true;
                throw new Error(errorMessage);
            }
            __classPrivateFieldSet$2(this, _validated$1, true);
        }
        dispose() {
            if (!this.disposed) {
                this.context.gl.deleteShader(this.glShader);
                this.context.disposeResource(this);
                this.disposed = true;
            }
        }
    }
    _validated$1 = new WeakMap();

    class VertexArrayObject {
        constructor(program, bufferGeometry) {
            this.program = program;
            this.disposed = false;
            this.primitive = PrimitiveType.Triangles;
            this.offset = 0;
            this.count = -1;
            this.primitive = bufferGeometry.primitive;
            this.count = bufferGeometry.count;
            const glxVAO = this.program.context.glx.OES_vertex_array_object;
            {
                const vao = glxVAO.createVertexArrayOES();
                if (vao === null) {
                    throw new Error("createVertexArray failed");
                }
                this.glVertexArrayObject = vao;
            }
            glxVAO.bindVertexArrayOES(this.glVertexArrayObject);
            program.setAttributeBuffers(bufferGeometry);
            this.id = this.program.context.registerResource(this);
        }
        dispose() {
            if (!this.disposed) {
                const glxVAO = this.program.context.glx.OES_vertex_array_object;
                glxVAO.deleteVertexArrayOES(this.glVertexArrayObject);
                this.program.context.disposeResource(this);
                this.disposed = true;
            }
        }
    }

    class ProgramAttribute {
        constructor(program, index) {
            this.program = program;
            this.index = index;
            this.name = name;
            const gl = program.context.gl;
            {
                const activeInfo = gl.getActiveAttrib(program.glProgram, index);
                if (activeInfo === null) {
                    throw new Error(`can not find attribute with index: ${index}`);
                }
                this.name = activeInfo.name;
                this.size = activeInfo.size;
                this.type = activeInfo.type;
                const glLocation = gl.getAttribLocation(program.glProgram, this.name);
                if (glLocation < 0) {
                    throw new Error(`can not find attribute named: ${this.name}`);
                }
                this.glLocation = glLocation;
            }
        }
        setBuffer(bufferAccessor) {
            const gl = this.program.context.gl;
            gl.enableVertexAttribArray(this.glLocation);
            gl.bindBuffer(GL.ARRAY_BUFFER, bufferAccessor.buffer.glBuffer);
            gl.vertexAttribPointer(this.glLocation, bufferAccessor.componentsPerVertex, bufferAccessor.componentType, bufferAccessor.normalized, bufferAccessor.vertexStride, bufferAccessor.byteOffset);
            return this;
        }
    }

    function linearizeVector2FloatArray(array) {
        const result = new Float32Array(array.length * 2);
        for (let i = 0; i < array.length; i++) {
            array[i].toArray(result, i * 2);
        }
        return result;
    }
    function linearizeVector3FloatArray(array) {
        const result = new Float32Array(array.length * 3);
        for (let i = 0; i < array.length; i++) {
            array[i].toArray(result, i * 3);
        }
        return result;
    }
    function linearizeMatrix3FloatArray(array) {
        const result = new Float32Array(array.length * 9);
        for (let i = 0; i < array.length; i++) {
            array[i].toArray(result, i * 9);
        }
        return result;
    }
    function linearizeMatrix4FloatArray(array) {
        const result = new Float32Array(array.length * 16);
        for (let i = 0; i < array.length; i++) {
            array[i].toArray(result, i * 16);
        }
        return result;
    }

    var DataType;
    (function (DataType) {
        DataType[DataType["Byte"] = GL.BYTE] = "Byte";
        DataType[DataType["UnsignedByte"] = GL.UNSIGNED_BYTE] = "UnsignedByte";
        DataType[DataType["Short"] = GL.SHORT] = "Short";
        DataType[DataType["UnsignedShort"] = GL.UNSIGNED_SHORT] = "UnsignedShort";
        DataType[DataType["Int"] = GL.INT] = "Int";
        DataType[DataType["UnsignedInt"] = GL.UNSIGNED_INT] = "UnsignedInt";
        DataType[DataType["Float"] = GL.FLOAT] = "Float";
    })(DataType || (DataType = {}));

    var PixelEncoding;
    (function (PixelEncoding) {
        PixelEncoding[PixelEncoding["Linear"] = 0] = "Linear";
        PixelEncoding[PixelEncoding["sRGB"] = 1] = "sRGB";
        PixelEncoding[PixelEncoding["RGBE"] = 2] = "RGBE";
        PixelEncoding[PixelEncoding["RGBD"] = 3] = "RGBD";
    })(PixelEncoding || (PixelEncoding = {}));

    class ArrayBufferImage {
        constructor(data, width, height, dataType = DataType.UnsignedByte, pixelEncoding = PixelEncoding.sRGB) {
            this.data = data;
            this.width = width;
            this.height = height;
            this.dataType = dataType;
            this.pixelEncoding = pixelEncoding;
        }
    }

    var PixelFormat;
    (function (PixelFormat) {
        PixelFormat[PixelFormat["RGBA"] = GL.RGBA] = "RGBA";
        PixelFormat[PixelFormat["RGB"] = GL.RGB] = "RGB";
        PixelFormat[PixelFormat["LuminanceAlpha"] = GL.LUMINANCE_ALPHA] = "LuminanceAlpha";
        PixelFormat[PixelFormat["Luminance"] = GL.LUMINANCE] = "Luminance";
        PixelFormat[PixelFormat["Alpha"] = GL.ALPHA] = "Alpha";
        PixelFormat[PixelFormat["DepthComponent"] = GL.DEPTH_COMPONENT] = "DepthComponent";
        PixelFormat[PixelFormat["DepthStencil"] = GL.DEPTH_STENCIL] = "DepthStencil";
    })(PixelFormat || (PixelFormat = {}));

    var TextureFilter;
    (function (TextureFilter) {
        TextureFilter[TextureFilter["LinearMipmapLinear"] = GL.LINEAR_MIPMAP_LINEAR] = "LinearMipmapLinear";
        TextureFilter[TextureFilter["LinearMipmapNearest"] = GL.LINEAR_MIPMAP_NEAREST] = "LinearMipmapNearest";
        TextureFilter[TextureFilter["Linear"] = GL.LINEAR] = "Linear";
        TextureFilter[TextureFilter["Nearest"] = GL.NEAREST] = "Nearest";
        TextureFilter[TextureFilter["NearestMipmapLinear"] = GL.NEAREST_MIPMAP_LINEAR] = "NearestMipmapLinear";
        TextureFilter[TextureFilter["NearestMipmapNearest"] = GL.NEAREST_MIPMAP_NEAREST] = "NearestMipmapNearest";
    })(TextureFilter || (TextureFilter = {}));

    var TextureWrap;
    (function (TextureWrap) {
        TextureWrap[TextureWrap["MirroredRepeat"] = GL.MIRRORED_REPEAT] = "MirroredRepeat";
        TextureWrap[TextureWrap["ClampToEdge"] = GL.CLAMP_TO_EDGE] = "ClampToEdge";
        TextureWrap[TextureWrap["Repeat"] = GL.REPEAT] = "Repeat";
    })(TextureWrap || (TextureWrap = {}));

    class TexParameters {
        constructor() {
            this.generateMipmaps = true;
            this.wrapS = TextureWrap.Repeat;
            this.wrapT = TextureWrap.Repeat;
            this.magFilter = TextureFilter.Linear;
            this.minFilter = TextureFilter.LinearMipmapLinear;
            this.anisotropyLevels = 2;
        }
    }

    var TextureTarget;
    (function (TextureTarget) {
        TextureTarget[TextureTarget["Texture2D"] = GL.TEXTURE_2D] = "Texture2D";
        TextureTarget[TextureTarget["TextureCubeMap"] = GL.TEXTURE_CUBE_MAP] = "TextureCubeMap";
        TextureTarget[TextureTarget["CubeMapPositiveX"] = GL.TEXTURE_CUBE_MAP_POSITIVE_X] = "CubeMapPositiveX";
        TextureTarget[TextureTarget["CubeMapNegativeX"] = GL.TEXTURE_CUBE_MAP_NEGATIVE_X] = "CubeMapNegativeX";
        TextureTarget[TextureTarget["CubeMapPositiveY"] = GL.TEXTURE_CUBE_MAP_POSITIVE_Y] = "CubeMapPositiveY";
        TextureTarget[TextureTarget["CubeMapNegativeY"] = GL.TEXTURE_CUBE_MAP_NEGATIVE_Y] = "CubeMapNegativeY";
        TextureTarget[TextureTarget["CubeMapPositiveZ"] = GL.TEXTURE_CUBE_MAP_POSITIVE_Z] = "CubeMapPositiveZ";
        TextureTarget[TextureTarget["CubeMapNegativeZ"] = GL.TEXTURE_CUBE_MAP_NEGATIVE_Z] = "CubeMapNegativeZ";
    })(TextureTarget || (TextureTarget = {}));

    class TexImage2D {
        constructor(context, images, internalFormat = PixelFormat.RGBA, dataType = DataType.UnsignedByte, pixelFormat = PixelFormat.RGBA, target = TextureTarget.Texture2D, texParameters = new TexParameters()) {
            this.context = context;
            this.images = images;
            this.internalFormat = internalFormat;
            this.dataType = dataType;
            this.pixelFormat = pixelFormat;
            this.target = target;
            this.texParameters = texParameters;
            this.disposed = false;
            this.size = new Vector2();
            const gl = this.context.gl;
            {
                const glTexture = gl.createTexture();
                if (glTexture === null) {
                    throw new Error("createTexture failed");
                }
                this.glTexture = glTexture;
            }
            this.loadImages(images);
            gl.texParameteri(this.target, GL.TEXTURE_WRAP_S, texParameters.wrapS);
            gl.texParameteri(this.target, GL.TEXTURE_WRAP_T, texParameters.wrapS);
            gl.texParameteri(this.target, GL.TEXTURE_MAG_FILTER, texParameters.magFilter);
            gl.texParameteri(this.target, GL.TEXTURE_MIN_FILTER, texParameters.minFilter);
            if (texParameters.anisotropyLevels > 1) {
                const tfa = this.context.glxo.EXT_texture_filter_anisotropic;
                if (tfa !== null) {
                    const maxAllowableAnisotropy = gl.getParameter(tfa.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                    gl.texParameterf(this.target, tfa.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texParameters.anisotropyLevels, maxAllowableAnisotropy));
                }
            }
            if (texParameters.generateMipmaps) {
                if (isPow2(this.size.width) && isPow2(this.size.height)) {
                    gl.generateMipmap(this.target);
                }
            }
            gl.bindTexture(this.target, null);
            this.id = this.context.registerResource(this);
        }
        generateMipmaps() {
            const gl = this.context.gl;
            gl.bindTexture(this.target, this.glTexture);
            gl.generateMipmap(this.target);
            gl.bindTexture(this.target, null);
            this.texParameters.generateMipmaps = true;
        }
        get mipCount() {
            if (!this.texParameters.generateMipmaps) {
                return 1;
            }
            return Math.floor(Math.log2(Math.max(this.size.width, this.size.height)));
        }
        dispose() {
            if (!this.disposed) {
                this.context.gl.deleteTexture(this.glTexture);
                this.context.disposeResource(this);
                this.disposed = true;
            }
        }
        loadImages(images) {
            const gl = this.context.gl;
            gl.bindTexture(this.target, this.glTexture);
            if (images.length === 1) {
                this.loadImage(images[0]);
            }
            else if (this.target === TextureTarget.TextureCubeMap) {
                const numLevels = Math.floor(this.images.length / 6);
                for (let level = 0; level < numLevels; level++) {
                    for (let face = 0; face < 6; face++) {
                        const imageIndex = level * 6 + face;
                        const image = images[imageIndex];
                        this.loadImage(image, TextureTarget.CubeMapPositiveX + face, level);
                    }
                }
            }
            else {
                throw new Error("Unsupported number of images");
            }
        }
        loadImage(image, target = undefined, level = 0) {
            const gl = this.context.gl;
            if (image instanceof Vector2) {
                gl.texImage2D(target !== null && target !== void 0 ? target : this.target, level, this.internalFormat, image.width, image.height, 0, this.pixelFormat, this.dataType, null);
                if (level === 0) {
                    this.size.set(image.width, image.height);
                }
            }
            else if (image instanceof ArrayBufferImage) {
                gl.texImage2D(target !== null && target !== void 0 ? target : this.target, level, this.internalFormat, image.width, image.height, 0, this.pixelFormat, this.dataType, new Uint8Array(image.data));
                if (level === 0) {
                    this.size.set(image.width, image.height);
                }
            }
            else {
                gl.texImage2D(target !== null && target !== void 0 ? target : this.target, level, this.internalFormat, this.pixelFormat, this.dataType, image);
                this.size.set(image.width, image.height);
            }
        }
    }

    var UniformType;
    (function (UniformType) {
        UniformType[UniformType["Bool"] = GL.BOOL] = "Bool";
        UniformType[UniformType["BoolVec2"] = GL.BOOL_VEC2] = "BoolVec2";
        UniformType[UniformType["BoolVec3"] = GL.BOOL_VEC3] = "BoolVec3";
        UniformType[UniformType["BoolVec4"] = GL.BOOL_VEC4] = "BoolVec4";
        UniformType[UniformType["Int"] = GL.INT] = "Int";
        UniformType[UniformType["IntVec2"] = GL.INT_VEC2] = "IntVec2";
        UniformType[UniformType["IntVec3"] = GL.INT_VEC3] = "IntVec3";
        UniformType[UniformType["IntVec4"] = GL.INT_VEC4] = "IntVec4";
        UniformType[UniformType["Float"] = GL.FLOAT] = "Float";
        UniformType[UniformType["FloatVec2"] = GL.FLOAT_VEC2] = "FloatVec2";
        UniformType[UniformType["FloatVec3"] = GL.FLOAT_VEC3] = "FloatVec3";
        UniformType[UniformType["FloatVec4"] = GL.FLOAT_VEC4] = "FloatVec4";
        UniformType[UniformType["FloatMat2"] = GL.FLOAT_MAT2] = "FloatMat2";
        UniformType[UniformType["FloatMat3"] = GL.FLOAT_MAT3] = "FloatMat3";
        UniformType[UniformType["FloatMat4"] = GL.FLOAT_MAT4] = "FloatMat4";
        UniformType[UniformType["Sampler2D"] = GL.SAMPLER_2D] = "Sampler2D";
        UniformType[UniformType["SamplerCube"] = GL.SAMPLER_CUBE] = "SamplerCube";
    })(UniformType || (UniformType = {}));
    function numTextureUnits(uniformType) {
        switch (uniformType) {
            case UniformType.Sampler2D:
                return 1;
            case UniformType.SamplerCube:
                return 1;
            default:
                return 0;
        }
    }

    const array1dRegexp = /^([a-zA-Z_0-9]+)\[[0-9]+\]$/;
    class ProgramUniform {
        constructor(program, index) {
            this.program = program;
            this.index = index;
            this.valueHashCode = 982345792759832448;
            this.textureUnit = -1;
            this.context = program.context;
            const gl = program.context.gl;
            {
                const activeInfo = gl.getActiveUniform(program.glProgram, index);
                if (activeInfo === null) {
                    throw new Error(`Can not find uniform with index: ${index}`);
                }
                const array1dMatch = activeInfo.name.match(array1dRegexp);
                if (array1dMatch !== null) {
                    this.name = array1dMatch[1];
                    this.dimensions = 1;
                }
                else {
                    this.name = activeInfo.name;
                    this.dimensions = 0;
                }
                this.size = activeInfo.size;
                this.uniformType = activeInfo.type;
                const glLocation = gl.getUniformLocation(program.glProgram, this.name);
                if (glLocation === null) {
                    throw new Error(`can not find uniform named: ${this.name}`);
                }
                this.glLocation = glLocation;
            }
        }
        set(value) {
            const gl = this.context.gl;
            switch (this.uniformType) {
                case UniformType.Int:
                    if (typeof value === "number") {
                        if (value !== this.valueHashCode) {
                            gl.uniform1i(this.glLocation, value);
                            this.valueHashCode = value;
                        }
                        return this;
                    }
                    if (value instanceof Array && value.length > 0 && typeof value[0] === "number") {
                        gl.uniform1iv(this.glLocation, value);
                        this.valueHashCode = -1;
                        return this;
                    }
                    break;
                case UniformType.Float:
                    if (typeof value === "number") {
                        if (value !== this.valueHashCode) {
                            gl.uniform1f(this.glLocation, value);
                            this.valueHashCode = value;
                        }
                        return this;
                    }
                    if (value instanceof Array && value.length > 0 && typeof value[0] === "number") {
                        gl.uniform1fv(this.glLocation, value);
                        this.valueHashCode = -1;
                        return this;
                    }
                    break;
                case UniformType.FloatVec2:
                    if (value instanceof Vector2) {
                        const hashCode = value.getHashCode();
                        if (hashCode !== this.valueHashCode) {
                            gl.uniform2f(this.glLocation, value.x, value.y);
                            this.valueHashCode = hashCode;
                        }
                        return this;
                    }
                    if (value instanceof Array && value.length > 0 && value[0] instanceof Vector2) {
                        const array = linearizeVector2FloatArray(value);
                        gl.uniform2fv(this.glLocation, array);
                        this.valueHashCode = -1;
                        return this;
                    }
                    break;
                case UniformType.FloatVec3:
                    if (value instanceof Vector3) {
                        const hashCode = value.getHashCode();
                        if (hashCode !== this.valueHashCode) {
                            gl.uniform3f(this.glLocation, value.x, value.y, value.z);
                            this.valueHashCode = hashCode;
                        }
                        return this;
                    }
                    if (value instanceof Array && value.length > 0 && value[0] instanceof Vector3) {
                        const array = linearizeVector3FloatArray(value);
                        gl.uniform3fv(this.glLocation, array);
                        this.valueHashCode = -1;
                        return this;
                    }
                    break;
                case UniformType.FloatMat3:
                    if (value instanceof Matrix3) {
                        const hashCode = value.getHashCode();
                        if (hashCode !== this.valueHashCode) {
                            gl.uniformMatrix3fv(this.glLocation, false, value.elements);
                            this.valueHashCode = hashCode;
                        }
                        return this;
                    }
                    if (value instanceof Array && value.length > 0 && value[0] instanceof Matrix4) {
                        const array = linearizeMatrix3FloatArray(value);
                        gl.uniformMatrix4fv(this.glLocation, false, array);
                        this.valueHashCode = -1;
                        return this;
                    }
                    break;
                case UniformType.FloatMat4:
                    if (value instanceof Matrix4) {
                        const hashCode = value.getHashCode();
                        if (hashCode !== this.valueHashCode) {
                            gl.uniformMatrix4fv(this.glLocation, false, value.elements);
                            this.valueHashCode = hashCode;
                        }
                        return this;
                    }
                    if (value instanceof Array && value.length > 0 && value[0] instanceof Matrix4) {
                        const array = linearizeMatrix4FloatArray(value);
                        gl.uniformMatrix4fv(this.glLocation, false, array);
                        this.valueHashCode = -1;
                        return this;
                    }
                    break;
                case UniformType.Sampler2D:
                    if (value instanceof TexImage2D) {
                        gl.activeTexture(GL.TEXTURE0 + this.textureUnit);
                        gl.bindTexture(GL.TEXTURE_2D, value.glTexture);
                        gl.uniform1i(this.glLocation, this.textureUnit);
                        return this;
                    }
                    break;
                case UniformType.SamplerCube:
                    if (value instanceof TexImage2D) {
                        gl.activeTexture(GL.TEXTURE0 + this.textureUnit);
                        gl.bindTexture(GL.TEXTURE_CUBE_MAP, value.glTexture);
                        gl.uniform1i(this.glLocation, this.textureUnit);
                        return this;
                    }
                    break;
            }
            throw new Error(`unsupported uniform type - value mismatch: ${UniformType[this.uniformType]}(${this.uniformType}) on '${this.name}'`);
        }
    }

    var __classPrivateFieldGet$1 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var __classPrivateFieldSet$1 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    var _validated, _uniformsInitialized, _uniforms, _attributesInitialized, _attributes;
    class Program {
        constructor(context, vertexShaderCode, fragmentShaderCode, glslVersion) {
            this.context = context;
            this.disposed = false;
            _validated.set(this, false);
            _uniformsInitialized.set(this, false);
            _uniforms.set(this, {});
            _attributesInitialized.set(this, false);
            _attributes.set(this, {});
            this.vertexShader = new Shader(this.context, vertexShaderCode, ShaderType.Vertex, glslVersion);
            this.fragmentShader = new Shader(this.context, fragmentShaderCode, ShaderType.Fragment, glslVersion);
            const gl = this.context.gl;
            {
                const glProgram = gl.createProgram();
                if (glProgram === null) {
                    throw new Error("createProgram failed");
                }
                this.glProgram = glProgram;
            }
            gl.attachShader(this.glProgram, this.vertexShader.glShader);
            gl.attachShader(this.glProgram, this.fragmentShader.glShader);
            gl.linkProgram(this.glProgram);
            this.id = this.context.registerResource(this);
        }
        validate() {
            if (__classPrivateFieldGet$1(this, _validated) || this.disposed) {
                return true;
            }
            const gl = this.context.gl;
            const psc = this.context.glxo.KHR_parallel_shader_compile;
            if (psc !== null) {
                if (!gl.getProgramParameter(this.glProgram, psc.COMPLETION_STATUS_KHR)) {
                    return false;
                }
            }
            if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
                this.vertexShader.validate();
                this.fragmentShader.validate();
                const infoLog = gl.getProgramInfoLog(this.glProgram);
                console.error(infoLog);
                this.vertexShader.dispose();
                this.fragmentShader.dispose();
                this.disposed = true;
                throw new Error(`program filed to link: ${infoLog}`);
            }
            __classPrivateFieldSet$1(this, _validated, true);
            return true;
        }
        get uniforms() {
            if (!__classPrivateFieldGet$1(this, _uniformsInitialized)) {
                let textureUnitCount = 0;
                const gl = this.context.gl;
                const numActiveUniforms = gl.getProgramParameter(this.glProgram, gl.ACTIVE_UNIFORMS);
                for (let i = 0; i < numActiveUniforms; ++i) {
                    const uniform = new ProgramUniform(this, i);
                    if (numTextureUnits(uniform.uniformType) > 0) {
                        uniform.textureUnit = textureUnitCount;
                        textureUnitCount++;
                    }
                    __classPrivateFieldGet$1(this, _uniforms)[uniform.name] = uniform;
                }
                __classPrivateFieldSet$1(this, _uniformsInitialized, true);
            }
            return __classPrivateFieldGet$1(this, _uniforms);
        }
        get attributes() {
            if (!__classPrivateFieldGet$1(this, _attributesInitialized)) {
                const gl = this.context.gl;
                const numActiveAttributes = gl.getProgramParameter(this.glProgram, gl.ACTIVE_ATTRIBUTES);
                for (let i = 0; i < numActiveAttributes; ++i) {
                    const attribute = new ProgramAttribute(this, i);
                    __classPrivateFieldGet$1(this, _attributes)[attribute.name] = attribute;
                }
                __classPrivateFieldSet$1(this, _attributesInitialized, true);
            }
            return __classPrivateFieldGet$1(this, _attributes);
        }
        setUniformValues(uniformValueMap) {
            this.context.program = this;
            for (const uniformName in uniformValueMap) {
                const uniform = this.uniforms[uniformName];
                if (uniform !== undefined) {
                    uniform.set(uniformValueMap[uniformName]);
                }
            }
            return this;
        }
        setAttributeBuffers(buffers) {
            const gl = this.context.gl;
            const glxVAO = this.context.glx.OES_vertex_array_object;
            if (buffers instanceof BufferGeometry) {
                const bufferGeometry = buffers;
                for (const name in this.attributes) {
                    const attribute = this.attributes[name];
                    const bufferAccessor = bufferGeometry.bufferAccessors[name];
                    if (attribute !== undefined && bufferAccessor !== undefined) {
                        attribute.setBuffer(bufferAccessor);
                    }
                }
                if (bufferGeometry.indices !== undefined) {
                    gl.bindBuffer(bufferGeometry.indices.buffer.target, bufferGeometry.indices.buffer.glBuffer);
                }
            }
            else if (buffers instanceof VertexArrayObject) {
                const vao = buffers;
                glxVAO.bindVertexArrayOES(vao.glVertexArrayObject);
            }
            else {
                throw new Error("not implemented");
            }
            return this;
        }
        dispose() {
            if (!this.disposed) {
                this.vertexShader.dispose();
                this.fragmentShader.dispose();
                this.context.gl.deleteProgram(this.glProgram);
                this.context.disposeResource(this);
                this.disposed = true;
            }
        }
    }
    _validated = new WeakMap(), _uniformsInitialized = new WeakMap(), _uniforms = new WeakMap(), _attributesInitialized = new WeakMap(), _attributes = new WeakMap();
    function makeProgramFromShaderMaterial(context, shaderMaterial) {
        return new Program(context, shaderMaterial.vertexShaderCode, shaderMaterial.fragmentShaderCode, shaderMaterial.glslVersion);
    }

    var WindingOrder;
    (function (WindingOrder) {
        WindingOrder[WindingOrder["Clockwise"] = GL.CW] = "Clockwise";
        WindingOrder[WindingOrder["CounterClockwise"] = GL.CCW] = "CounterClockwise";
    })(WindingOrder || (WindingOrder = {}));
    var CullingSide;
    (function (CullingSide) {
        CullingSide[CullingSide["Front"] = GL.FRONT] = "Front";
        CullingSide[CullingSide["Back"] = GL.BACK] = "Back";
        CullingSide[CullingSide["FrontBack"] = GL.FRONT_AND_BACK] = "FrontBack";
    })(CullingSide || (CullingSide = {}));
    class CullingState {
        constructor(enabled = true, sides = CullingSide.Back, windingOrder = WindingOrder.CounterClockwise) {
            this.enabled = enabled;
            this.sides = sides;
            this.windingOrder = windingOrder;
        }
        clone() {
            return new CullingState(this.enabled, this.sides, this.windingOrder);
        }
        copy(cs) {
            this.enabled = cs.enabled;
            this.sides = cs.sides;
            this.windingOrder = cs.windingOrder;
        }
        equals(cs) {
            return this.enabled === cs.enabled && this.sides === cs.sides && this.windingOrder === cs.windingOrder;
        }
    }

    var DepthTestFunc;
    (function (DepthTestFunc) {
        DepthTestFunc[DepthTestFunc["Never"] = GL.NEVER] = "Never";
        DepthTestFunc[DepthTestFunc["Less"] = GL.LESS] = "Less";
        DepthTestFunc[DepthTestFunc["Equal"] = GL.EQUAL] = "Equal";
        DepthTestFunc[DepthTestFunc["LessOrEqual"] = GL.LEQUAL] = "LessOrEqual";
        DepthTestFunc[DepthTestFunc["Greater"] = GL.GREATER] = "Greater";
        DepthTestFunc[DepthTestFunc["NotEqual"] = GL.NOTEQUAL] = "NotEqual";
        DepthTestFunc[DepthTestFunc["GreaterOrEqual"] = GL.GEQUAL] = "GreaterOrEqual";
        DepthTestFunc[DepthTestFunc["Always"] = GL.ALWAYS] = "Always";
    })(DepthTestFunc || (DepthTestFunc = {}));
    class DepthTestState {
        constructor(enabled = false, func = DepthTestFunc.Less) {
            this.enabled = enabled;
            this.func = func;
        }
        clone() {
            return new DepthTestState(this.enabled, this.func);
        }
        copy(dts) {
            this.enabled = dts.enabled;
            this.func = dts.func;
        }
        equals(dts) {
            return this.enabled === dts.enabled && this.func === dts.func;
        }
    }

    function getRequiredExtension(gl, extensionName) {
        const ext = gl.getExtension(extensionName);
        if (ext === null) {
            throw new Error(`required extension ${extensionName} not available.`);
        }
        return ext;
    }
    class Extensions {
        constructor(gl) {
            this.OES_element_index_uint = getRequiredExtension(gl, "OES_element_index_uint");
            this.OES_standard_derivatives = getRequiredExtension(gl, "OES_standard_derivatives");
            this.OES_vertex_array_object = getRequiredExtension(gl, "OES_vertex_array_object");
            this.WEBGL_depth_texture = getRequiredExtension(gl, "WEBGL_depth_texture");
        }
    }

    class KHR_parallel_shader_compile {
        constructor() {
            this.MAX_SHADER_COMPILER_THREADS_KHR = 0x91b0;
            this.COMPLETION_STATUS_KHR = 0x91b1;
        }
    }
    class OptionalExtensions {
        constructor(gl) {
            this.EXT_shader_texture_lod = gl.getExtension("EXT_shader_texture_lod");
            this.EXT_texture_filter_anisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
            this.KHR_parallel_shader_compile =
                gl.getExtension("KHR_parallel_shader_compile") !== null ? new KHR_parallel_shader_compile() : null;
            this.WEBGL_debug_renderer_info = gl.getExtension("WEBGL_debug_renderer_info");
            this.WEBGL_debug_shaders = gl.getExtension("WEBGL_debug_shaders");
        }
    }

    class CanvasFramebuffer extends VirtualFramebuffer {
        constructor(context) {
            super(context);
            this.autoLayoutMode = true;
            this.devicePixelRatio = 1.0;
            this.canvas = context.gl.canvas;
            this.resize();
        }
        resize() {
            const canvas = this.canvas;
            if (canvas instanceof HTMLCanvasElement) {
                const width = Math.floor(canvas.clientWidth * this.devicePixelRatio);
                const height = Math.floor(canvas.clientHeight * this.devicePixelRatio);
                if (canvas.width !== width || canvas.height !== height) {
                    canvas.width = width;
                    canvas.height = height;
                }
            }
        }
        get size() {
            return new Vector2(this.context.gl.drawingBufferWidth, this.context.gl.drawingBufferHeight);
        }
        get aspectRatio() {
            return this.context.gl.drawingBufferWidth / this.context.gl.drawingBufferHeight;
        }
        dispose() { }
    }

    class MaskState {
        constructor(red = true, green = true, blue = true, alpha = true, depth = true, stencil = 0) {
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.alpha = alpha;
            this.depth = depth;
            this.stencil = stencil;
        }
        clone() {
            return new MaskState(this.red, this.green, this.blue, this.alpha, this.depth, this.stencil);
        }
        copy(ms) {
            this.red = ms.red;
            this.green = ms.green;
            this.blue = ms.blue;
            this.alpha = ms.alpha;
            this.depth = ms.depth;
            this.stencil = ms.stencil;
        }
        equals(ms) {
            return (this.red === ms.red &&
                this.green === ms.green &&
                this.blue === ms.blue &&
                this.alpha === ms.alpha &&
                this.depth === ms.depth &&
                this.stencil === ms.stencil);
        }
    }

    function getParameterAsString(gl, parameterId, result = "") {
        const text = gl.getParameter(parameterId);
        if (typeof text === "string") {
            result = text;
        }
        return result;
    }

    var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var _program, _framebuffer, _scissor, _viewport, _depthTestState, _blendState, _clearState, _maskState, _cullingState;
    class RenderingContext {
        constructor(canvas, attributes = undefined) {
            this.canvas = canvas;
            this.resources = {};
            this.nextResourceId = 0;
            _program.set(this, undefined);
            _framebuffer.set(this, void 0);
            _scissor.set(this, new Box2());
            _viewport.set(this, new Box2());
            _depthTestState.set(this, new DepthTestState());
            _blendState.set(this, new BlendState());
            _clearState.set(this, new ClearState());
            _maskState.set(this, new MaskState());
            _cullingState.set(this, new CullingState());
            if (attributes === undefined) {
                attributes = {};
                attributes.alpha = true;
                attributes.antialias = true;
                attributes.depth = true;
                attributes.premultipliedAlpha = true;
                attributes.stencil = true;
            }
            {
                const gl = canvas.getContext("webgl", attributes);
                if (gl === null) {
                    throw new Error("webgl not supported");
                }
                this.gl = gl;
            }
            this.glx = new Extensions(this.gl);
            this.glxo = new OptionalExtensions(this.gl);
            this.canvasFramebuffer = new CanvasFramebuffer(this);
            __classPrivateFieldSet(this, _framebuffer, this.canvasFramebuffer);
        }
        registerResource(resource) {
            const id = this.nextResourceId++;
            this.resources[id] = resource;
            return id;
        }
        disposeResource(resource) {
            delete this.resources[resource.id];
        }
        get debugVendor() {
            const dri = this.glxo.WEBGL_debug_renderer_info;
            return dri !== null ? getParameterAsString(this.gl, dri.UNMASKED_VENDOR_WEBGL) : "";
        }
        get debugRenderer() {
            const dri = this.glxo.WEBGL_debug_renderer_info;
            return dri !== null ? getParameterAsString(this.gl, dri.UNMASKED_RENDERER_WEBGL) : "";
        }
        set program(program) {
            if (__classPrivateFieldGet(this, _program) !== program) {
                if (program !== undefined) {
                    program.validate();
                    this.gl.useProgram(program.glProgram);
                }
                else {
                    this.gl.useProgram(null);
                }
                __classPrivateFieldSet(this, _program, program);
            }
        }
        get program() {
            return __classPrivateFieldGet(this, _program);
        }
        set framebuffer(framebuffer) {
            if (__classPrivateFieldGet(this, _framebuffer) !== framebuffer) {
                if (framebuffer instanceof CanvasFramebuffer) {
                    this.gl.bindFramebuffer(GL.FRAMEBUFFER, null);
                }
                else if (framebuffer instanceof Framebuffer) {
                    this.gl.bindFramebuffer(GL.FRAMEBUFFER, framebuffer.glFramebuffer);
                }
                __classPrivateFieldSet(this, _framebuffer, framebuffer);
            }
        }
        get framebuffer() {
            return __classPrivateFieldGet(this, _framebuffer);
        }
        get scissor() {
            return __classPrivateFieldGet(this, _scissor).clone();
        }
        set scissor(s) {
            if (!__classPrivateFieldGet(this, _scissor).equals(s)) {
                this.gl.scissor(s.x, s.y, s.width, s.height);
                __classPrivateFieldGet(this, _scissor).copy(s);
            }
        }
        get viewport() {
            return __classPrivateFieldGet(this, _viewport).clone();
        }
        set viewport(v) {
            if (!__classPrivateFieldGet(this, _viewport).equals(v)) {
                this.gl.viewport(v.x, v.y, v.width, v.height);
                __classPrivateFieldGet(this, _viewport).copy(v);
            }
        }
        get blendState() {
            return __classPrivateFieldGet(this, _blendState).clone();
        }
        set blendState(bs) {
            if (!__classPrivateFieldGet(this, _blendState).equals(bs)) {
                this.gl.enable(GL.BLEND);
                this.gl.blendEquation(bs.equation);
                this.gl.blendFuncSeparate(bs.sourceRGBFactor, bs.destRGBFactor, bs.sourceAlphaFactor, bs.destAlphaFactor);
                __classPrivateFieldGet(this, _blendState).copy(bs);
            }
        }
        get depthTestState() {
            return __classPrivateFieldGet(this, _depthTestState).clone();
        }
        set depthTestState(dts) {
            if (!__classPrivateFieldGet(this, _depthTestState).equals(dts)) {
                if (dts.enabled) {
                    this.gl.enable(GL.DEPTH_TEST);
                }
                else {
                    this.gl.disable(GL.DEPTH_TEST);
                }
                this.gl.depthFunc(dts.func);
                __classPrivateFieldGet(this, _depthTestState).copy(dts);
            }
        }
        get clearState() {
            return __classPrivateFieldGet(this, _clearState).clone();
        }
        set clearState(cs) {
            if (!__classPrivateFieldGet(this, _clearState).equals(cs)) {
                this.gl.clearColor(cs.color.r, cs.color.g, cs.color.b, cs.alpha);
                this.gl.clearDepth(cs.depth);
                this.gl.clearStencil(cs.stencil);
                __classPrivateFieldGet(this, _clearState).copy(cs);
            }
        }
        get maskState() {
            return __classPrivateFieldGet(this, _maskState).clone();
        }
        set maskState(ms) {
            if (!__classPrivateFieldGet(this, _maskState).equals(ms)) {
                this.gl.colorMask(ms.red, ms.green, ms.blue, ms.alpha);
                this.gl.depthMask(ms.depth);
                this.gl.stencilMask(ms.stencil);
                __classPrivateFieldGet(this, _maskState).copy(ms);
            }
        }
        get cullingState() {
            return __classPrivateFieldGet(this, _cullingState).clone();
        }
        set cullingState(cs) {
            if (!__classPrivateFieldGet(this, _cullingState).equals(cs)) {
                if (cs.enabled) {
                    this.gl.enable(GL.CULL_FACE);
                }
                else {
                    this.gl.disable(GL.CULL_FACE);
                }
                this.gl.frontFace(cs.windingOrder);
                this.gl.cullFace(cs.sides);
                __classPrivateFieldGet(this, _cullingState).copy(cs);
            }
        }
    }
    _program = new WeakMap(), _framebuffer = new WeakMap(), _scissor = new WeakMap(), _viewport = new WeakMap(), _depthTestState = new WeakMap(), _blendState = new WeakMap(), _clearState = new WeakMap(), _maskState = new WeakMap(), _cullingState = new WeakMap();

    function passGeometry(min = new Vector2(-1, -1), max = new Vector2(1, 1)) {
        const geometry = new Geometry();
        geometry.indices = makeUint32Attribute([0, 1, 2, 0, 2, 3]);
        geometry.attributes["position"] = makeFloat32Attribute([min.x, min.y, min.x, max.y, max.x, max.y, max.x, min.y], 2);
        geometry.attributes["uv"] = makeFloat32Attribute([0, 1, 0, 0, 1, 0, 1, 1], 2);
        geometry.attributes["normal"] = makeFloat32Attribute([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], 3);
        return geometry;
    }

    class VirtualTexture {
        constructor(level = 0, magFilter = TextureFilter.Linear, minFilter = TextureFilter.Linear, pixelFormat = PixelFormat.RGBA, dataType = DataType.UnsignedByte, generateMipmaps = true, anisotropicLevels = 1) {
            this.level = level;
            this.magFilter = magFilter;
            this.minFilter = minFilter;
            this.pixelFormat = pixelFormat;
            this.dataType = dataType;
            this.generateMipmaps = generateMipmaps;
            this.anisotropicLevels = anisotropicLevels;
            this.disposed = false;
            this.uuid = generateUUID();
            this.version = 0;
            this.name = "";
            this.size = new Vector2();
        }
        get mipCount() {
            if (!this.generateMipmaps) {
                return 1;
            }
            return Math.floor(Math.log2(Math.max(this.size.width, this.size.height)));
        }
        dirty() {
            this.version++;
        }
        dispose() {
            if (!this.disposed) {
                this.disposed = true;
                this.dirty();
            }
        }
    }

    [
        TextureTarget.CubeMapPositiveX,
        TextureTarget.CubeMapNegativeX,
        TextureTarget.CubeMapPositiveY,
        TextureTarget.CubeMapNegativeY,
        TextureTarget.CubeMapPositiveZ,
        TextureTarget.CubeMapNegativeZ,
    ];

    var _lib_shaders_includes_math_math_glsl = /* glsl */ `
#ifndef _lib_shaders_includes_math_math_glsl
#define _lib_shaders_includes_math_math_glsl


const float PI = 3.141592653589793;
const float PI2 = 6.283185307179586;
const float PI_HALF = 1.5707963267948966;
const float RECIPROCAL_PI = 0.3183098861837907;
const float RECIPROCAL_PI2 = 0.15915494309189535;
const float EPSILON = 1e-6;

float saturate( const in float a ) { return clamp( a, 0., 1. ); }
vec3 saturate( const in vec3 a ) { return clamp( a, 0., 1. ); }
vec3 whiteComplement( const in vec3 a ) { return 1. - saturate(a); }
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.333333333333 ) ); }
float degToRad( const in float deg ) { return deg * PI / 180.; }
float radToDeg( const in float rad ) { return rad * 180. / PI; }

const float NAN = sqrt( 0. );
bool isnan( const in float x ) {
  // this appears to be against the specification. another solution was offered here:
  // https://www.shadertoy.com/view/lsjBDy
  return (x) == NAN;
}
bool isinf( const in float x ) {
  return (x) == (x)+1.;
}



#endif // end of include guard
`;

    var _lib_shaders_includes_math_spherical_glsl = /* glsl */ `
#ifndef _lib_shaders_includes_math_spherical_glsl
#define _lib_shaders_includes_math_spherical_glsl


// -z is spherical axis
vec3 nzSphericalToCartesian( vec2 s ) {
  vec2 cs = cos( s );
  vec2 ss = sin( s );
	return vec3( cs.x * ss.y, cs.y, ss.x * ss.y );
}

// -z is spherical axis
vec2 cartesianToNZSpherical( vec3 dir ) {
	return vec2( atan( dir.z, dir.x ), acos( dir.y ) );
}




#endif // end of include guard
`;

    var _lib_shaders_includes_cubemaps_latLong_glsl = /* glsl */ `
#ifndef _lib_shaders_includes_cubemaps_latLong_glsl
#define _lib_shaders_includes_cubemaps_latLong_glsl


${_lib_shaders_includes_math_math_glsl}
${_lib_shaders_includes_math_spherical_glsl}

/**
 * local direction -> equirectangular uvs
 */
vec2 directionToLatLongUV( in vec3 dir ) {
  vec2 s = cartesianToNZSpherical( dir );
	return vec2(
		fract( s.x * RECIPROCAL_PI2 + 0.75 ), // this makes maps -z dir to the center of the UV space.
		s.y / PI) ;
}

/**
 * equirectangular uvs -> local direction
 */
vec3 latLongUvToDirection( in vec2 latLongUv ) {
  vec2 s = vec2(
    ( latLongUv.x - 0.75 ) * PI2,
    latLongUv.y * PI );
  return nzSphericalToCartesian( s );
}



#endif // end of include guard
`;

    function makeTexImage2DFromTexture(context, texture, internalFormat = PixelFormat.RGBA) {
        const params = new TexParameters();
        params.anisotropyLevels = texture.anisotropicLevels;
        params.generateMipmaps = texture.generateMipmaps;
        params.magFilter = texture.magFilter;
        params.minFilter = texture.minFilter;
        params.wrapS = texture.wrapS;
        params.wrapT = texture.wrapT;
        return new TexImage2D(context, [texture.image], texture.pixelFormat, texture.dataType, internalFormat, TextureTarget.Texture2D, params);
    }

    function fetchImageElement(url, size = new Vector2()) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            if (size.x > 0 || size.y > 0) {
                image.width = size.x;
                image.height = size.y;
            }
            image.crossOrigin = "anonymous";
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", () => {
                reject(new Error(`failed to load image: ${url}`));
            });
            image.src = url;
        });
    }
    function fetchImageBitmap(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                if (response.status === 200) {
                    return response.blob();
                }
                reject(`Unable to load resource with url ${url}`);
            })
                .then((blobData) => {
                if (blobData !== undefined) {
                    return createImageBitmap(blobData);
                }
            })
                .then((imageBitmap) => {
                return resolve(imageBitmap);
            }, (err) => {
                reject(err);
            });
        });
    }
    function isImageBitmapSupported() {
        return "createImageBitmap" in window;
    }
    function fetchImage(url) {
        if (isImageBitmapSupported() && !url.includes(".svg")) {
            return fetchImageBitmap(url);
        }
        return fetchImageElement(url);
    }

    class Texture extends VirtualTexture {
        constructor(image, wrapS = TextureWrap.ClampToEdge, wrapT = TextureWrap.ClampToEdge, level = 0, magFilter = TextureFilter.Linear, minFilter = TextureFilter.LinearMipmapLinear, pixelFormat = PixelFormat.RGBA, dataType = DataType.UnsignedByte, generateMipmaps = true, anisotropicLevels = 1) {
            super(level, magFilter, minFilter, pixelFormat, dataType, generateMipmaps, anisotropicLevels);
            this.image = image;
            this.wrapS = wrapS;
            this.wrapT = wrapT;
            this.size = new Vector2(image.width, image.height);
        }
    }

    var _lib_shaders_includes_color_spaces_srgb_glsl = /* glsl */ `
#ifndef _lib_shaders_includes_color_spaces_srgb_glsl
#define _lib_shaders_includes_color_spaces_srgb_glsl

${_lib_shaders_includes_math_math_glsl}

vec3 sRGBToLinear( in vec3 value ) {
	return vec3( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ) );
}

vec3 linearTosRGB( in vec3 value ) {
	return vec3( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ) );
}



#endif // end of include guard
`;

    (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };
    (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    var ImageFitMode;
    (function (ImageFitMode) {
        ImageFitMode[ImageFitMode["FitWidth"] = 0] = "FitWidth";
        ImageFitMode[ImageFitMode["FitHeight"] = 1] = "FitHeight";
    })(ImageFitMode || (ImageFitMode = {}));

    var OutputChannels;
    (function (OutputChannels) {
        OutputChannels[OutputChannels["Beauty"] = 0] = "Beauty";
        OutputChannels[OutputChannels["Albedo"] = 1] = "Albedo";
        OutputChannels[OutputChannels["Roughness"] = 2] = "Roughness";
        OutputChannels[OutputChannels["Metalness"] = 3] = "Metalness";
        OutputChannels[OutputChannels["Occlusion"] = 4] = "Occlusion";
        OutputChannels[OutputChannels["Emissive"] = 5] = "Emissive";
        OutputChannels[OutputChannels["Normal"] = 6] = "Normal";
        OutputChannels[OutputChannels["Depth"] = 7] = "Depth";
        OutputChannels[OutputChannels["Ambient"] = 8] = "Ambient";
        OutputChannels[OutputChannels["Diffuse"] = 9] = "Diffuse";
        OutputChannels[OutputChannels["Specular"] = 10] = "Specular";
        OutputChannels[OutputChannels["DepthPacked"] = 11] = "DepthPacked";
        OutputChannels[OutputChannels["MetalnessRoughnessOcclusion"] = 12] = "MetalnessRoughnessOcclusion";
    })(OutputChannels || (OutputChannels = {}));

    (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    (undefined && undefined.__classPrivateFieldGet) || function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };
    (undefined && undefined.__classPrivateFieldSet) || function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    var LightType;
    (function (LightType) {
        LightType[LightType["Directional"] = 0] = "Directional";
        LightType[LightType["Point"] = 1] = "Point";
        LightType[LightType["Spot"] = 2] = "Spot";
    })(LightType || (LightType = {}));

    var TextureSourceType;
    (function (TextureSourceType) {
        TextureSourceType[TextureSourceType["ArrayBufferView"] = 0] = "ArrayBufferView";
        TextureSourceType[TextureSourceType["ImageDate"] = 1] = "ImageDate";
        TextureSourceType[TextureSourceType["HTMLImageElement"] = 2] = "HTMLImageElement";
        TextureSourceType[TextureSourceType["HTMLCanvasElement"] = 3] = "HTMLCanvasElement";
        TextureSourceType[TextureSourceType["HTMLVideoElement"] = 4] = "HTMLVideoElement";
        TextureSourceType[TextureSourceType["ImageBitmap"] = 5] = "ImageBitmap";
    })(TextureSourceType || (TextureSourceType = {}));

    var fragmentSource = /* glsl */ `
precision highp float;

uniform mat4 viewToWorld;
uniform mat4 screenToView;

uniform sampler2D equirectangularMap;

varying vec4 v_homogeneousVertexPosition;

${_lib_shaders_includes_color_spaces_srgb_glsl}
${_lib_shaders_includes_cubemaps_latLong_glsl}

void main() {

  // step one, convert from screen space to ray.
  vec3 viewPosition = ( viewToWorld * screenToView * v_homogeneousVertexPosition ).xyz;
  vec3 viewDirection = normalize( viewPosition );

  vec2 equirectangularUv = directionToLatLongUV( viewDirection );

  vec3 outputColor = vec3(0.);
  outputColor += sRGBToLinear( texture2D( equirectangularMap, equirectangularUv ).rgb );

  gl_FragColor.rgb = linearTosRGB( outputColor );
  gl_FragColor.a = 1.0;

}

`;

    var vertexSource = /* glsl */ `
attribute vec3 position;

varying vec4 v_homogeneousVertexPosition;

void main() {

  // homogeneous vertex position
  gl_Position.xy = position.xy;
  gl_Position.z = -1.; // position at near clipping plane.  (set to 1. for far clipping plane.)
  gl_Position.w = 1.; // nortmalized

  v_homogeneousVertexPosition = gl_Position;

}

`;

    async function init() {
        const geometry = passGeometry();
        const passMaterial = new ShaderMaterial(vertexSource, fragmentSource);
        const context = new RenderingContext(document.getElementById("framebuffer"));
        let imageIndex = 0;
        const images = [];
        const textures = [];
        const texImage2Ds = [];
        for (let i = 0; i < 5; i++) {
            images.push(fetchImage(`/assets/textures/cube/kitchen/kitchenb_${i + 1}.jpg`).then((image) => {
                const texture = new Texture(image);
                texture.wrapS = TextureWrap.ClampToEdge;
                texture.wrapT = TextureWrap.ClampToEdge;
                texture.minFilter = TextureFilter.Linear;
                textures[i] = texture;
                texImage2Ds[i] = makeTexImage2DFromTexture(context, texture);
            }));
        }
        await Promise.all(images);
        const canvasFramebuffer = context.canvasFramebuffer;
        window.addEventListener("resize", () => canvasFramebuffer.resize());
        const orbit = new Orbit(context.canvas);
        const passProgram = makeProgramFromShaderMaterial(context, passMaterial);
        const passUniforms = {
            viewToWorld: new Matrix4(),
            screenToView: makeMatrix4Inverse(makeMatrix4PerspectiveFov(30, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio)),
            equirectangularMap: texImage2Ds[0],
        };
        const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
        const depthTestState = new DepthTestState(true, DepthTestFunc.Less);
        function animate() {
            requestAnimationFrame(animate);
            passUniforms.viewToWorld = makeMatrix4Inverse(makeMatrix4RotationFromQuaternion(orbit.orientation));
            passUniforms.screenToView = makeMatrix4Inverse(makeMatrix4PerspectiveFov((15 * (1 - orbit.zoom)) + 15, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio));
            passUniforms.equirectangularMap = texImage2Ds[imageIndex];
            renderBufferGeometry(canvasFramebuffer, passProgram, passUniforms, bufferGeometry, depthTestState);
            orbit.update();
        }
        animate();
        window.addEventListener("keydown", function (event) {
            if (event.key !== undefined) {
                imageIndex = (event.key.charCodeAt(0) - '0'.charCodeAt(0)) % images.length;
            }
        }, true);
        return null;
    }
    init();
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return;
        }
        if (event.key !== undefined) ;
        else if (event.keyCode !== undefined) ;
    }, true);

}());
