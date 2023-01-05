const arrayBuffer = new ArrayBuffer(12 * 16);
const floatArray = new Float32Array(arrayBuffer);
const intArray = new Int32Array(arrayBuffer);
function hashFloat1(v) {
  floatArray[0] = v;
  return intArray[0];
}
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

var EulerOrder3;
(function (EulerOrder3) {
  EulerOrder3[(EulerOrder3['XYZ'] = 0)] = 'XYZ';
  EulerOrder3[(EulerOrder3['YXZ'] = 1)] = 'YXZ';
  EulerOrder3[(EulerOrder3['ZXY'] = 2)] = 'ZXY';
  EulerOrder3[(EulerOrder3['ZYX'] = 3)] = 'ZYX';
  EulerOrder3[(EulerOrder3['YZX'] = 4)] = 'YZX';
  EulerOrder3[(EulerOrder3['XZY'] = 5)] = 'XZY';
  EulerOrder3[(EulerOrder3['Default'] = 0)] = 'Default';
})(EulerOrder3 || (EulerOrder3 = {}));
class Euler3 {
  constructor(x = 0, y = 0, z = 0, order = EulerOrder3.Default) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }
  getHashCode() {
    return hashFloat4(this.x, this.y, this.z, this.order);
  }
  set(x, y, z, order = EulerOrder3.Default) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    return this;
  }
  clone() {
    return new Euler3().copy(this);
  }
  copy(e) {
    return this.set(e.x, e.y, e.z, e.order);
  }
  equals(e) {
    return (
      e.x === this.x &&
      e.y === this.y &&
      e.z === this.z &&
      e.order === this.order
    );
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
function degToRad(degrees) {
  return degrees * (Math.PI / 180.0);
}
function radToDeg(radian) {
  return radian * (180.0 / Math.PI);
}
function isPow2(value) {
  return (value & (value - 1)) === 0 && value !== 0;
}
function ceilPow2(value) {
  return 2 ** Math.ceil(Math.log(value) / Math.LN2);
}
function floorPow2(value) {
  return 2 ** Math.floor(Math.log(value) / Math.LN2);
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
    const qax = this.x;
    const qay = this.y;
    const qaz = this.z;
    const qaw = this.w;
    const qbx = q.x;
    const qby = q.y;
    const qbz = q.z;
    const qbw = q.w;
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
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  normalize() {
    let l = this.length();
    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
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
    const { x } = this;
    const { y } = this;
    const { z } = this;
    const { w } = this;
    let cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;
    if (cosHalfTheta < 0) {
      this.w = -qb.w;
      this.x = -qb.x;
      this.y = -qb.y;
      this.z = -qb.z;
      cosHalfTheta = -cosHalfTheta;
    } else {
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
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
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
  const { x } = e;
  const { y } = e;
  const { z } = e;
  const { order } = e;
  const c1 = Math.cos(x / 2);
  const c2 = Math.cos(y / 2);
  const c3 = Math.cos(z / 2);
  const s1 = Math.sin(x / 2);
  const s2 = Math.sin(y / 2);
  const s3 = Math.sin(z / 2);
  switch (order) {
    case EulerOrder3.XYZ:
      return result.set(
        s1 * c2 * c3 + c1 * s2 * s3,
        c1 * s2 * c3 - s1 * c2 * s3,
        c1 * c2 * s3 + s1 * s2 * c3,
        c1 * c2 * c3 - s1 * s2 * s3
      );
    case EulerOrder3.YXZ:
      return result.set(
        s1 * c2 * c3 + c1 * s2 * s3,
        c1 * s2 * c3 - s1 * c2 * s3,
        c1 * c2 * s3 - s1 * s2 * c3,
        c1 * c2 * c3 + s1 * s2 * s3
      );
    case EulerOrder3.ZXY:
      return result.set(
        s1 * c2 * c3 - c1 * s2 * s3,
        c1 * s2 * c3 + s1 * c2 * s3,
        c1 * c2 * s3 + s1 * s2 * c3,
        c1 * c2 * c3 - s1 * s2 * s3
      );
    case EulerOrder3.ZYX:
      return result.set(
        s1 * c2 * c3 - c1 * s2 * s3,
        c1 * s2 * c3 + s1 * c2 * s3,
        c1 * c2 * s3 - s1 * s2 * c3,
        c1 * c2 * c3 + s1 * s2 * s3
      );
    case EulerOrder3.YZX:
      return result.set(
        s1 * c2 * c3 + c1 * s2 * s3,
        c1 * s2 * c3 + s1 * c2 * s3,
        c1 * c2 * s3 - s1 * s2 * c3,
        c1 * c2 * c3 - s1 * s2 * s3
      );
    case EulerOrder3.XZY:
      return result.set(
        s1 * c2 * c3 - c1 * s2 * s3,
        c1 * s2 * c3 - s1 * c2 * s3,
        c1 * c2 * s3 + s1 * s2 * c3,
        c1 * c2 * c3 + s1 * s2 * s3
      );
    default:
      throw new Error('unsupported euler order');
  }
}
function makeQuaternionFromRotationMatrix4(m, result = new Quaternion()) {
  const te = m.elements;
  const m11 = te[0];
  const m12 = te[4];
  const m13 = te[8];
  const m21 = te[1];
  const m22 = te[5];
  const m23 = te[9];
  const m31 = te[2];
  const m32 = te[6];
  const m33 = te[10];
  const trace = m11 + m22 + m33;
  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1.0);
    return result.set(
      (m32 - m23) * s,
      (m13 - m31) * s,
      (m21 - m12) * s,
      0.25 / s
    );
  }
  if (m11 > m22 && m11 > m33) {
    const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
    return result.set(
      0.25 * s,
      (m12 + m21) / s,
      (m13 + m31) / s,
      (m32 - m23) / s
    );
  }
  if (m22 > m33) {
    const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
    return result.set(
      (m12 + m21) / s,
      0.25 * s,
      (m23 + m32) / s,
      (m13 - m31) / s
    );
  }
  const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
  return result.set(
    (m13 + m31) / s,
    (m23 + m32) / s,
    0.25 * s,
    (m21 - m12) / s
  );
}
function makeQuaternionFromAxisAngle(axis, angle, result = new Quaternion()) {
  const halfAngle = angle / 2;
  const s = Math.sin(halfAngle);
  return result.set(axis.x * s, axis.y * s, axis.z * s, Math.cos(halfAngle));
}
function makeQuaternionFromBaryCoordWeights(
  baryCoord,
  a,
  b,
  c,
  result = new Quaternion()
) {
  const v = baryCoord;
  return result.set(
    a.x * v.x + b.x * v.y + c.x * v.z,
    a.y * v.x + b.y * v.y + c.y * v.z,
    a.z * v.x + b.z * v.y + c.z * v.z,
    a.w * v.x + b.w * v.y + c.w * v.z
  );
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
    if (index === 1) {
      return this.y;
    }
    if (index === 2) {
      return this.z;
    }
    throw new Error(`index of our range: ${index}`);
  }
  setComponent(index, value) {
    if (index === 0) {
      this.x = value;
    } else if (index === 1) {
      this.y = value;
    } else if (index === 2) {
      this.z = value;
    } else {
      throw new Error(`index of our range: ${index}`);
    }
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  cross(v) {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const bx = v.x;
    const by = v.y;
    const bz = v.z;
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

const zAxis = new Vector3(0, 0, 1);
const q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
class DeviceOrientation {
  constructor() {
    this.disposed = false;
    this.deviceOrientation = new Euler3(0, 0, 0, EulerOrder3.YXZ);
    this.screenOrientation = 0;
    this.tempValue = new Quaternion();
    const onDeviceOrientation = (event) => {
      this.deviceOrientation.set(
        degToRad(event.beta ?? 0),
        degToRad(event.alpha ?? 0 - 180.0),
        -degToRad(event.gamma ?? 0),
        EulerOrder3.YXZ
      );
    };
    const onOrientationChange = () => {
      console.log('orientation', window.orientation);
      this.screenOrientation = -degToRad(window.orientation);
    };
    window.addEventListener('orientationchange', onOrientationChange, false);
    window.addEventListener('deviceorientation', onDeviceOrientation, false);
    this.onDispose = () => {
      window.removeEventListener(
        'orientationchange',
        onOrientationChange,
        false
      );
      window.removeEventListener(
        'deviceorientation',
        onDeviceOrientation,
        false
      );
    };
  }
  get orientation() {
    const result = makeQuaternionFromEuler(this.deviceOrientation);
    result.multiply(q1);
    result.multiply(
      makeQuaternionFromAxisAngle(zAxis, this.screenOrientation, this.tempValue)
    );
    return result;
  }
  dispose() {
    if (!this.disposed) {
      this.onDispose();
      this.disposed = true;
    }
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
    if (index === 1) {
      return this.y;
    }
    throw new Error(`index of our range: ${index}`);
  }
  setComponent(index, value) {
    if (index === 0) {
      this.x = value;
    } else if (index === 1) {
      this.y = value;
    } else {
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
    this.euler = new Euler3();
    this.eulerMomentum = new Euler3();
    this.zoom = 0;
    this.zoomMomentum = 0;
    this.damping = 0.1;
    this.onPointerDownHandler = this.onPointerDown.bind(this);
    this.onPointerCancelHandler = this.onPointerCancel.bind(this);
    this.onPointerUpHandler = this.onPointerUp.bind(this);
    this.onPointerMoveHandler = this.onPointerMove.bind(this);
    this.onMouseWheelHandler = this.onMouseWheel.bind(this);
    this.domElement.style.touchAction = 'none';
    this.domElement.addEventListener(
      'pointerdown',
      this.onPointerDownHandler,
      false
    );
    this.domElement.addEventListener(
      'pointercancel',
      this.onPointerCancelHandler,
      false
    );
    this.domElement.addEventListener('wheel', this.onMouseWheelHandler, false);
  }
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      this.domElement.removeEventListener(
        'pointerdown',
        this.onPointerDownHandler
      );
      this.domElement.removeEventListener(
        'pointercancel',
        this.onPointerCancelHandler
      );
    }
  }
  onPointerDown(pe) {
    this.domElement.setPointerCapture(pe.pointerId);
    this.domElement.addEventListener(
      'pointermove',
      this.onPointerMoveHandler,
      false
    );
    this.domElement.addEventListener(
      'pointerup',
      this.onPointerUpHandler,
      false
    );
    this.lastPointerClient.set(pe.clientX, pe.clientY);
  }
  onPointerUp(pe) {
    this.domElement.releasePointerCapture(pe.pointerId);
    this.domElement.removeEventListener(
      'pointermove',
      this.onPointerMoveHandler
    );
    this.domElement.removeEventListener('pointerup', this.onPointerUpHandler);
  }
  onMouseWheel(we) {
    this.zoomMomentum += we.deltaY * this.damping * 0.002;
  }
  onPointerMove(pe) {
    const pointerClient = new Vector2(pe.clientX, pe.clientY);
    const pointerClientDelta = pointerClient
      .clone()
      .sub(this.lastPointerClient);
    pointerClientDelta.x /= this.domElement.clientWidth;
    pointerClientDelta.y /= this.domElement.clientHeight;
    this.eulerMomentum.x += pointerClientDelta.y * Math.PI * this.damping;
    this.eulerMomentum.y += pointerClientDelta.x * Math.PI * this.damping;
    this.lastPointerClient.copy(pointerClient);
  }
  update() {
    this.euler.x += this.eulerMomentum.x;
    this.euler.y += this.eulerMomentum.y;
    this.eulerMomentum.x *= 1 - this.damping;
    this.eulerMomentum.y *= 1 - this.damping;
    this.orientation = makeQuaternionFromEuler(this.euler, this.orientation);
    this.zoom += this.zoomMomentum;
    this.zoomMomentum *= 1 - this.damping;
    this.zoom = Math.min(1, Math.max(0, this.zoom));
  }
  onPointerCancel(pe) {}
}

function assertTrue(condition, message = 'assertTrue failure') {
  if (!condition) {
    throw new Error(message);
  }
  return condition;
}

class WorldSpace {}
WorldSpace.Right = new Vector3(1, 0, 0);
WorldSpace.Up = new Vector3(0, 1, 0);
WorldSpace.Forward = new Vector3(0, 0, -1);
class ClipSpace {}
ClipSpace.TopLeftFront = new Vector3(-1, -1, -1);
ClipSpace.BottomRightBack = new Vector3(1, 1, 1);
ClipSpace.Top = 1;
ClipSpace.Bottom = -1;
ClipSpace.Left = -1;
ClipSpace.Right = 1;
ClipSpace.Near = -1;
ClipSpace.Far = 1;
class ScreenSpace {}
ScreenSpace.TopLeft = new Vector2(0, 1);
ScreenSpace.TopRight = new Vector2(1, 1);
ScreenSpace.BottomLeft = new Vector2(0, 0);
ScreenSpace.BottomRight = new Vector2(1, 0);
ScreenSpace.Top = 1;
ScreenSpace.Bottom = 0;
ScreenSpace.Left = 0;
ScreenSpace.Right = 1;
ScreenSpace.Near = 0;
ScreenSpace.Far = 1;
class TextureSpace {}
TextureSpace.TopLeft = new Vector2(0, 0);
TextureSpace.TopRight = new Vector2(1, 0);
TextureSpace.BottomLeft = new Vector2(1, 0);
TextureSpace.BottomRight = new Vector2(1, 1);
TextureSpace.Top = 0;
TextureSpace.Bottom = 1;
TextureSpace.Left = 0;
TextureSpace.Right = 1;

const _lut = [];
for (let i = 0; i < 256; i++) {
  _lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}
function generateUUID() {
  const d0 = (Math.random() * 0x100000000) | 0;
  const d1 = (Math.random() * 0x100000000) | 0;
  const d2 = (Math.random() * 0x100000000) | 0;
  const d3 = (Math.random() * 0x100000000) | 0;
  const uuid = `${
    _lut[d0 & 0xff] +
    _lut[(d0 >> 8) & 0xff] +
    _lut[(d0 >> 16) & 0xff] +
    _lut[(d0 >> 24) & 0xff]
  }-${_lut[d1 & 0xff]}${_lut[(d1 >> 8) & 0xff]}-${
    _lut[((d1 >> 16) & 0x0f) | 0x40]
  }${_lut[(d1 >> 24) & 0xff]}-${_lut[(d2 & 0x3f) | 0x80]}${
    _lut[(d2 >> 8) & 0xff]
  }-${_lut[(d2 >> 16) & 0xff]}${_lut[(d2 >> 24) & 0xff]}${_lut[d3 & 0xff]}${
    _lut[(d3 >> 8) & 0xff]
  }${_lut[(d3 >> 16) & 0xff]}${_lut[(d3 >> 24) & 0xff]}`;
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

function makeMatrix3Concatenation(a, b, result = new Matrix3()) {
  const ae = a.elements;
  const be = b.elements;
  const te = result.elements;
  const a11 = ae[0];
  const a12 = ae[3];
  const a13 = ae[6];
  const a21 = ae[1];
  const a22 = ae[4];
  const a23 = ae[7];
  const a31 = ae[2];
  const a32 = ae[5];
  const a33 = ae[8];
  const b11 = be[0];
  const b12 = be[3];
  const b13 = be[6];
  const b21 = be[1];
  const b22 = be[4];
  const b23 = be[7];
  const b31 = be[2];
  const b32 = be[5];
  const b33 = be[8];
  te[0] = a11 * b11 + a12 * b21 + a13 * b31;
  te[3] = a11 * b12 + a12 * b22 + a13 * b32;
  te[6] = a11 * b13 + a12 * b23 + a13 * b33;
  te[1] = a21 * b11 + a22 * b21 + a23 * b31;
  te[4] = a21 * b12 + a22 * b22 + a23 * b32;
  te[7] = a21 * b13 + a22 * b23 + a23 * b33;
  te[2] = a31 * b11 + a32 * b21 + a33 * b31;
  te[5] = a31 * b12 + a32 * b22 + a33 * b32;
  te[8] = a31 * b13 + a32 * b23 + a33 * b33;
  return result;
}
function matrix3Determinant(m) {
  const te = m.elements;
  const a = te[0];
  const b = te[1];
  const c = te[2];
  const d = te[3];
  const e = te[4];
  const f = te[5];
  const g = te[6];
  const h = te[7];
  const i = te[8];
  return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
}
function makeMatrix3Transpose(m, result = new Matrix3()) {
  let tmp;
  const me = result.copy(m).elements;
  tmp = me[1];
  me[1] = me[3];
  me[3] = tmp;
  tmp = me[2];
  me[2] = me[6];
  me[6] = tmp;
  tmp = me[5];
  me[5] = me[7];
  me[7] = tmp;
  return result;
}
function makeMatrix3Inverse(m, result = new Matrix3()) {
  const e = m.elements;
  const n11 = e[0];
  const n21 = e[1];
  const n31 = e[2];
  const n12 = e[3];
  const n22 = e[4];
  const n32 = e[5];
  const n13 = e[6];
  const n23 = e[7];
  const n33 = e[8];
  const t11 = n33 * n22 - n32 * n23;
  const t12 = n32 * n13 - n33 * n12;
  const t13 = n23 * n12 - n22 * n13;
  const det = n11 * t11 + n21 * t12 + n31 * t13;
  if (det === 0) {
    throw new Error('can not invert degenerate matrix');
  }
  const detInv = 1 / det;
  const re = result.elements;
  re[0] = t11 * detInv;
  re[1] = (n31 * n23 - n33 * n21) * detInv;
  re[2] = (n32 * n21 - n31 * n22) * detInv;
  re[3] = t12 * detInv;
  re[4] = (n33 * n11 - n31 * n13) * detInv;
  re[5] = (n31 * n12 - n32 * n11) * detInv;
  re[6] = t13 * detInv;
  re[7] = (n21 * n13 - n23 * n11) * detInv;
  re[8] = (n22 * n11 - n21 * n12) * detInv;
  return result;
}
function makeMatrix3Translation(t, result = new Matrix3()) {
  return result.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1);
}
function makeMatrix3RotationFromAngle(angle, result = new Matrix3()) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return result.set(c, -s, 0, s, c, 0, 0, 0, 1);
}
function makeMatrix3Scale(s, result = new Matrix3()) {
  return result.set(s.x, 0, 0, 0, s.y, 0, 0, 0, 1.0);
}

class Matrix4 {
  constructor() {
    this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
  getHashCode() {
    return hashFloatArray(this.elements);
  }
  set(
    n11,
    n12,
    n13,
    n14,
    n21,
    n22,
    n23,
    n24,
    n31,
    n32,
    n33,
    n34,
    n41,
    n42,
    n43,
    n44
  ) {
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
    return this.set(
      me[0],
      me[4],
      me[8],
      me[12],
      me[1],
      me[5],
      me[9],
      me[13],
      me[2],
      me[6],
      me[10],
      me[14],
      me[3],
      me[7],
      me[11],
      me[15]
    );
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

function makeMatrix4Concatenation(a, b, result = new Matrix4()) {
  const ae = a.elements;
  const be = b.elements;
  const te = result.elements;
  const a11 = ae[0];
  const a12 = ae[4];
  const a13 = ae[8];
  const a14 = ae[12];
  const a21 = ae[1];
  const a22 = ae[5];
  const a23 = ae[9];
  const a24 = ae[13];
  const a31 = ae[2];
  const a32 = ae[6];
  const a33 = ae[10];
  const a34 = ae[14];
  const a41 = ae[3];
  const a42 = ae[7];
  const a43 = ae[11];
  const a44 = ae[15];
  const b11 = be[0];
  const b12 = be[4];
  const b13 = be[8];
  const b14 = be[12];
  const b21 = be[1];
  const b22 = be[5];
  const b23 = be[9];
  const b24 = be[13];
  const b31 = be[2];
  const b32 = be[6];
  const b33 = be[10];
  const b34 = be[14];
  const b41 = be[3];
  const b42 = be[7];
  const b43 = be[11];
  const b44 = be[15];
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
  return result;
}
function matrix4Determinant(m) {
  const me = m.elements;
  const n11 = me[0];
  const n21 = me[1];
  const n31 = me[2];
  const n41 = me[3];
  const n12 = me[4];
  const n22 = me[5];
  const n32 = me[6];
  const n42 = me[7];
  const n13 = me[8];
  const n23 = me[9];
  const n33 = me[10];
  const n43 = me[11];
  const n14 = me[12];
  const n24 = me[13];
  const n34 = me[14];
  const n44 = me[15];
  const t11 =
    n23 * n34 * n42 -
    n24 * n33 * n42 +
    n24 * n32 * n43 -
    n22 * n34 * n43 -
    n23 * n32 * n44 +
    n22 * n33 * n44;
  const t12 =
    n14 * n33 * n42 -
    n13 * n34 * n42 -
    n14 * n32 * n43 +
    n12 * n34 * n43 +
    n13 * n32 * n44 -
    n12 * n33 * n44;
  const t13 =
    n13 * n24 * n42 -
    n14 * n23 * n42 +
    n14 * n22 * n43 -
    n12 * n24 * n43 -
    n13 * n22 * n44 +
    n12 * n23 * n44;
  const t14 =
    n14 * n23 * n32 -
    n13 * n24 * n32 -
    n14 * n22 * n33 +
    n12 * n24 * n33 +
    n13 * n22 * n34 -
    n12 * n23 * n34;
  return n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
}
function makeMatrix4Transpose(m, result = new Matrix4()) {
  const re = result.copy(m).elements;
  let tmp;
  tmp = re[1];
  re[1] = re[4];
  re[4] = tmp;
  tmp = re[2];
  re[2] = re[8];
  re[8] = tmp;
  tmp = re[6];
  re[6] = re[9];
  re[9] = tmp;
  tmp = re[3];
  re[3] = re[12];
  re[12] = tmp;
  tmp = re[7];
  re[7] = re[13];
  re[13] = tmp;
  tmp = re[11];
  re[11] = re[14];
  re[14] = tmp;
  return result;
}
function makeMatrix4Inverse(m, result = new Matrix4()) {
  const me = m.elements;
  const n11 = me[0];
  const n21 = me[1];
  const n31 = me[2];
  const n41 = me[3];
  const n12 = me[4];
  const n22 = me[5];
  const n32 = me[6];
  const n42 = me[7];
  const n13 = me[8];
  const n23 = me[9];
  const n33 = me[10];
  const n43 = me[11];
  const n14 = me[12];
  const n24 = me[13];
  const n34 = me[14];
  const n44 = me[15];
  const t11 =
    n23 * n34 * n42 -
    n24 * n33 * n42 +
    n24 * n32 * n43 -
    n22 * n34 * n43 -
    n23 * n32 * n44 +
    n22 * n33 * n44;
  const t12 =
    n14 * n33 * n42 -
    n13 * n34 * n42 -
    n14 * n32 * n43 +
    n12 * n34 * n43 +
    n13 * n32 * n44 -
    n12 * n33 * n44;
  const t13 =
    n13 * n24 * n42 -
    n14 * n23 * n42 +
    n14 * n22 * n43 -
    n12 * n24 * n43 -
    n13 * n22 * n44 +
    n12 * n23 * n44;
  const t14 =
    n14 * n23 * n32 -
    n13 * n24 * n32 -
    n14 * n22 * n33 +
    n12 * n24 * n33 +
    n13 * n22 * n34 -
    n12 * n23 * n34;
  const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
  if (det === 0) {
    throw new Error('can not invert degenerate matrix');
  }
  const detInv = 1 / det;
  const re = result.elements;
  re[0] = t11 * detInv;
  re[1] =
    (n24 * n33 * n41 -
      n23 * n34 * n41 -
      n24 * n31 * n43 +
      n21 * n34 * n43 +
      n23 * n31 * n44 -
      n21 * n33 * n44) *
    detInv;
  re[2] =
    (n22 * n34 * n41 -
      n24 * n32 * n41 +
      n24 * n31 * n42 -
      n21 * n34 * n42 -
      n22 * n31 * n44 +
      n21 * n32 * n44) *
    detInv;
  re[3] =
    (n23 * n32 * n41 -
      n22 * n33 * n41 -
      n23 * n31 * n42 +
      n21 * n33 * n42 +
      n22 * n31 * n43 -
      n21 * n32 * n43) *
    detInv;
  re[4] = t12 * detInv;
  re[5] =
    (n13 * n34 * n41 -
      n14 * n33 * n41 +
      n14 * n31 * n43 -
      n11 * n34 * n43 -
      n13 * n31 * n44 +
      n11 * n33 * n44) *
    detInv;
  re[6] =
    (n14 * n32 * n41 -
      n12 * n34 * n41 -
      n14 * n31 * n42 +
      n11 * n34 * n42 +
      n12 * n31 * n44 -
      n11 * n32 * n44) *
    detInv;
  re[7] =
    (n12 * n33 * n41 -
      n13 * n32 * n41 +
      n13 * n31 * n42 -
      n11 * n33 * n42 -
      n12 * n31 * n43 +
      n11 * n32 * n43) *
    detInv;
  re[8] = t13 * detInv;
  re[9] =
    (n14 * n23 * n41 -
      n13 * n24 * n41 -
      n14 * n21 * n43 +
      n11 * n24 * n43 +
      n13 * n21 * n44 -
      n11 * n23 * n44) *
    detInv;
  re[10] =
    (n12 * n24 * n41 -
      n14 * n22 * n41 +
      n14 * n21 * n42 -
      n11 * n24 * n42 -
      n12 * n21 * n44 +
      n11 * n22 * n44) *
    detInv;
  re[11] =
    (n13 * n22 * n41 -
      n12 * n23 * n41 -
      n13 * n21 * n42 +
      n11 * n23 * n42 +
      n12 * n21 * n43 -
      n11 * n22 * n43) *
    detInv;
  re[12] = t14 * detInv;
  re[13] =
    (n13 * n24 * n31 -
      n14 * n23 * n31 +
      n14 * n21 * n33 -
      n11 * n24 * n33 -
      n13 * n21 * n34 +
      n11 * n23 * n34) *
    detInv;
  re[14] =
    (n14 * n22 * n31 -
      n12 * n24 * n31 -
      n14 * n21 * n32 +
      n11 * n24 * n32 +
      n12 * n21 * n34 -
      n11 * n22 * n34) *
    detInv;
  re[15] =
    (n12 * n23 * n31 -
      n13 * n22 * n31 +
      n13 * n21 * n32 -
      n11 * n23 * n32 -
      n12 * n21 * n33 +
      n11 * n22 * n33) *
    detInv;
  return result;
}
function makeMatrix4Translation(t, result = new Matrix4()) {
  return result.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1);
}
function makeMatrix4RotationFromAngleAxis(axis, angle, result = new Matrix4()) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  const { x } = axis;
  const { y } = axis;
  const { z } = axis;
  const tx = t * x;
  const ty = t * y;
  return result.set(
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
    1
  );
}
function makeMatrix4LookAt(eye, target, up, result = new Matrix4()) {
  const te = result.elements;
  const look = eye.clone().sub(target);
  const lookLength = look.length();
  if (lookLength === 0) {
    look.z = 1.0;
  } else {
    look.multiplyByScalar(1.0 / lookLength);
  }
  const right = up.clone().cross(look);
  const rightLength = right.length();
  if (rightLength === 0) {
    if (Math.abs(up.z) === 1) {
      up.x += 0.0001;
    } else {
      up.z += 0.0001;
    }
    up.normalize();
    right.cross(up);
  } else {
    right.multiplyByScalar(1.0 / rightLength);
  }
  const up2 = look.clone().cross(right);
  te[0] = right.x;
  te[4] = up2.x;
  te[8] = look.x;
  te[1] = right.y;
  te[5] = up2.y;
  te[9] = look.y;
  te[2] = right.z;
  te[6] = up2.z;
  te[10] = look.z;
  return result;
}
function makeMatrix4RotationFromEuler(euler, result = new Matrix4()) {
  const te = result.elements;
  const { x } = euler;
  const { y } = euler;
  const { z } = euler;
  const a = Math.cos(x);
  const b = Math.sin(x);
  const c = Math.cos(y);
  const d = Math.sin(y);
  const e = Math.cos(z);
  const f = Math.sin(z);
  if (euler.order === EulerOrder3.XYZ) {
    const ae = a * e;
    const af = a * f;
    const be = b * e;
    const bf = b * f;
    te[0] = c * e;
    te[4] = -c * f;
    te[8] = d;
    te[1] = af + be * d;
    te[5] = ae - bf * d;
    te[9] = -b * c;
    te[2] = bf - ae * d;
    te[6] = be + af * d;
    te[10] = a * c;
  } else if (euler.order === EulerOrder3.YXZ) {
    const ce = c * e;
    const cf = c * f;
    const de = d * e;
    const df = d * f;
    te[0] = ce + df * b;
    te[4] = de * b - cf;
    te[8] = a * d;
    te[1] = a * f;
    te[5] = a * e;
    te[9] = -b;
    te[2] = cf * b - de;
    te[6] = df + ce * b;
    te[10] = a * c;
  } else if (euler.order === EulerOrder3.ZXY) {
    const ce = c * e;
    const cf = c * f;
    const de = d * e;
    const df = d * f;
    te[0] = ce - df * b;
    te[4] = -a * f;
    te[8] = de + cf * b;
    te[1] = cf + de * b;
    te[5] = a * e;
    te[9] = df - ce * b;
    te[2] = -a * d;
    te[6] = b;
    te[10] = a * c;
  } else if (euler.order === EulerOrder3.ZYX) {
    const ae = a * e;
    const af = a * f;
    const be = b * e;
    const bf = b * f;
    te[0] = c * e;
    te[4] = be * d - af;
    te[8] = ae * d + bf;
    te[1] = c * f;
    te[5] = bf * d + ae;
    te[9] = af * d - be;
    te[2] = -d;
    te[6] = b * c;
    te[10] = a * c;
  } else if (euler.order === EulerOrder3.YZX) {
    const ac = a * c;
    const ad = a * d;
    const bc = b * c;
    const bd = b * d;
    te[0] = c * e;
    te[4] = bd - ac * f;
    te[8] = bc * f + ad;
    te[1] = f;
    te[5] = a * e;
    te[9] = -b * e;
    te[2] = -d * e;
    te[6] = ad * f + bc;
    te[10] = ac - bd * f;
  } else if (euler.order === EulerOrder3.XZY) {
    const ac = a * c;
    const ad = a * d;
    const bc = b * c;
    const bd = b * d;
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
  te[3] = 0;
  te[7] = 0;
  te[11] = 0;
  te[12] = 0;
  te[13] = 0;
  te[14] = 0;
  te[15] = 1;
  return result;
}
function makeMatrix4RotationFromQuaternion(q, result = new Matrix4()) {
  return composeMatrix4(new Vector3(), q, new Vector3(1, 1, 1), result);
}
function makeMatrix4Scale(s, result = new Matrix4()) {
  return result.set(s.x, 0, 0, 0, 0, s.y, 0, 0, 0, 0, s.z, 0, 0, 0, 0, 1);
}
function makeMatrix4Shear(x, y, z, result = new Matrix4()) {
  return result.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);
}
function getMaxScaleOnAxis(m) {
  const te = m.elements;
  const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
  const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
  const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
  return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
}
function composeMatrix4(position, rotation, scale, result = new Matrix4()) {
  const { x } = rotation;
  const { y } = rotation;
  const { z } = rotation;
  const { w } = rotation;
  const x2 = x + x;
  const y2 = y + y;
  const z2 = z + z;
  const xx = x * x2;
  const xy = x * y2;
  const xz = x * z2;
  const yy = y * y2;
  const yz = y * z2;
  const zz = z * z2;
  const wx = w * x2;
  const wy = w * y2;
  const wz = w * z2;
  const sx = scale.x;
  const sy = scale.y;
  const sz = scale.z;
  return result.set(
    (1 - (yy + zz)) * sx,
    (xy - wz) * sy,
    (xz + wy) * sz,
    position.x,
    (xy + wz) * sx,
    (1 - (xx + zz)) * sy,
    (yz - wx) * sz,
    position.y,
    (xz - wy) * sx,
    (yz + wx) * sy,
    (1 - (xx + yy)) * sz,
    position.z,
    0,
    0,
    0,
    1
  );
}
function decomposeMatrix4(m, position, rotation, scale) {
  const te = m.elements;
  let sx = new Vector3(te[0], te[1], te[2]).length();
  const sy = new Vector3(te[4], te[5], te[6]).length();
  const sz = new Vector3(te[8], te[9], te[10]).length();
  if (matrix4Determinant(m) < 0) {
    sx = -sx;
  }
  position.x = te[12];
  position.y = te[13];
  position.z = te[14];
  const m2 = new Matrix4().copy(m);
  const invSX = 1 / sx;
  const invSY = 1 / sy;
  const invSZ = 1 / sz;
  m2.elements[0] *= invSX;
  m2.elements[1] *= invSX;
  m2.elements[2] *= invSX;
  m2.elements[4] *= invSY;
  m2.elements[5] *= invSY;
  m2.elements[6] *= invSY;
  m2.elements[8] *= invSZ;
  m2.elements[9] *= invSZ;
  m2.elements[10] *= invSZ;
  makeQuaternionFromRotationMatrix4(m2, rotation);
  scale.x = sx;
  scale.y = sy;
  scale.z = sz;
  return m;
}
function makeMatrix4Perspective(
  left,
  right,
  top,
  bottom,
  near,
  far,
  result = new Matrix4()
) {
  const x = (2 * near) / (right - left);
  const y = (2 * near) / (top - bottom);
  const a = (right + left) / (right - left);
  const b = (top + bottom) / (top - bottom);
  const c = -(far + near) / (far - near);
  const d = (-2 * far * near) / (far - near);
  return result.set(x, 0, a, 0, 0, y, b, 0, 0, 0, c, d, 0, 0, -1, 0);
}
function makeMatrix4PerspectiveFov(
  verticalFov,
  near,
  far,
  zoom,
  aspectRatio,
  result = new Matrix4()
) {
  const height =
    (2.0 * near * Math.tan((verticalFov * Math.PI) / 180.0)) / zoom;
  const width = height * aspectRatio;
  const right = width * 0.5;
  const left = right - width;
  const top = height * 0.5;
  const bottom = top - height;
  return makeMatrix4Perspective(left, right, top, bottom, near, far, result);
}
function makeMatrix4Orthographic(
  left,
  right,
  top,
  bottom,
  near,
  far,
  result = new Matrix4()
) {
  const w = 1.0 / (right - left);
  const h = 1.0 / (top - bottom);
  const p = 1.0 / (far - near);
  const x = (right + left) * w;
  const y = (top + bottom) * h;
  const z = (far + near) * p;
  return result.set(
    2 * w,
    0,
    0,
    -x,
    0,
    2 * h,
    0,
    -y,
    0,
    0,
    -2 * p,
    -z,
    0,
    0,
    0,
    1
  );
}
function makeMatrix4OrthographicSimple(
  height,
  center,
  near,
  far,
  zoom,
  aspectRatio = 1.0,
  result = new Matrix4()
) {
  height /= zoom;
  const width = height * aspectRatio;
  const left = -width * 0.5 + center.x;
  const right = left + width;
  const top = -height * 0.5 + center.y;
  const bottom = top + height;
  return makeMatrix4Orthographic(left, right, top, bottom, near, far, result);
}

class Layer {
  constructor(
    compositor,
    url,
    texImage2D,
    offset,
    uvScaleFactor = new Vector2(1, -1),
    uvOffset = new Vector2(0, 1)
  ) {
    this.compositor = compositor;
    this.url = url;
    this.texImage2D = texImage2D;
    this.offset = offset;
    this.uvScaleFactor = uvScaleFactor;
    this.uvOffset = uvOffset;
    this.disposed = false;
    const planeToLayer = makeMatrix4Scale(
      new Vector3(this.texImage2D.size.width, this.texImage2D.size.height, 1.0)
    );
    const layerToImage = makeMatrix4Translation(
      new Vector3(this.offset.x, this.offset.y, 0.0)
    );
    this.planeToImage = makeMatrix4Concatenation(layerToImage, planeToLayer);
    const uvScale = makeMatrix3Scale(this.uvScaleFactor);
    const uvTranslation = makeMatrix3Translation(this.uvOffset);
    this.uvToTexture = makeMatrix3Concatenation(uvTranslation, uvScale);
  }
}

const GL = WebGLRenderingContext;

var ComponentType;
(function (ComponentType) {
  ComponentType[(ComponentType['Byte'] = GL.BYTE)] = 'Byte';
  ComponentType[(ComponentType['UnsignedByte'] = GL.UNSIGNED_BYTE)] =
    'UnsignedByte';
  ComponentType[(ComponentType['Short'] = GL.SHORT)] = 'Short';
  ComponentType[(ComponentType['UnsignedShort'] = GL.UNSIGNED_SHORT)] =
    'UnsignedShort';
  ComponentType[(ComponentType['Int'] = GL.INT)] = 'Int';
  ComponentType[(ComponentType['UnsignedInt'] = GL.UNSIGNED_INT)] =
    'UnsignedInt';
  ComponentType[(ComponentType['Float'] = GL.FLOAT)] = 'Float';
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
  BufferTarget[(BufferTarget['Array'] = GL.ARRAY_BUFFER)] = 'Array';
  BufferTarget[(BufferTarget['ElementArray'] = GL.ELEMENT_ARRAY_BUFFER)] =
    'ElementArray';
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
  constructor(
    attributeData,
    componentsPerVertex,
    componentType,
    vertexStride,
    byteOffset,
    normalized
  ) {
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
function makeUint8Attribute(
  array,
  componentsPerVertex = 1,
  normalized = false
) {
  return new Attribute(
    new AttributeData(
      (array instanceof Uint8Array ? array : new Uint8Array(array)).buffer
    ),
    componentsPerVertex,
    ComponentType.UnsignedByte,
    -1,
    0,
    normalized
  );
}
function makeInt16Attribute(
  array,
  componentsPerVertex = 1,
  normalized = false
) {
  return new Attribute(
    new AttributeData(
      (array instanceof Int16Array ? array : new Int16Array(array)).buffer
    ),
    componentsPerVertex,
    ComponentType.UnsignedShort,
    -1,
    0,
    normalized
  );
}
function makeUint32Attribute(
  array,
  componentsPerVertex = 1,
  normalized = false
) {
  return new Attribute(
    new AttributeData(
      (array instanceof Uint32Array ? array : new Uint32Array(array)).buffer
    ),
    componentsPerVertex,
    ComponentType.UnsignedInt,
    -1,
    0,
    normalized
  );
}
function makeInt32Attribute(
  array,
  componentsPerVertex = 1,
  normalized = false
) {
  return new Attribute(
    new AttributeData(
      (array instanceof Int32Array ? array : new Int32Array(array)).buffer
    ),
    componentsPerVertex,
    ComponentType.Int,
    -1,
    0,
    normalized
  );
}
function makeFloat32Attribute(
  array,
  componentsPerVertex = 1,
  normalized = false
) {
  return new Attribute(
    new AttributeData(
      (array instanceof Float32Array ? array : new Float32Array(array)).buffer
    ),
    componentsPerVertex,
    ComponentType.Float,
    -1,
    0,
    normalized
  );
}

class PrimitiveView {
  constructor(
    dataArray,
    floatPerPrimitive = -1,
    floatStride = -1,
    floatOffset = -1
  ) {
    this.floatStride = floatStride;
    this.floatOffset = floatOffset;
    if (dataArray instanceof Attribute) {
      if (this.floatStride >= 0) {
        throw new Error(
          'can not specify explicit byteStride when using Attribute argument'
        );
      }
      if (this.floatOffset >= 0) {
        throw new Error(
          'can not specify explicit byteOffset when using Attribute argument'
        );
      }
      this.floatOffset = dataArray.byteOffset / 4;
      this.floatStride = dataArray.vertexStride / 4;
      this.floatArray = new Float32Array(dataArray.attributeData.arrayBuffer);
    } else if (dataArray instanceof Float32Array) {
      this.floatArray = dataArray;
    } else if (dataArray instanceof ArrayBuffer) {
      this.floatArray = new Float32Array(dataArray);
    } else {
      throw new Error('unsupported value');
    }
    if (floatPerPrimitive < 0) {
      throw new Error(
        'must specify bytesPerPrimitive or provide an Attribute argument'
      );
    }
    if (this.floatStride < 0) {
      this.floatStride = floatPerPrimitive;
    }
    if (this.floatOffset < 0) {
      this.floatOffset = 0;
    }
    this.count = this.floatArray.length / this.floatStride;
  }
  set(index, v) {
    v.toArray(this.floatArray, index * this.floatStride + this.floatOffset);
    return this;
  }
  get(index, v) {
    v.setFromArray(
      this.floatArray,
      index * this.floatStride + this.floatOffset
    );
    return v;
  }
}
class Vector2View extends PrimitiveView {
  constructor(dataArray, floatStride = -1, floatOffset = -1) {
    super(dataArray, 2, floatStride, floatOffset);
    this.tempPrimitive = new Vector2();
  }
  add(index, v) {
    return this.set(index, this.get(index, this.tempPrimitive).add(v));
  }
}
class Vector3View extends PrimitiveView {
  constructor(dataArray, floatStride = -1, floatOffset = -1) {
    super(dataArray, 3, floatStride, floatOffset);
    this.tempPrimitive = new Vector3();
  }
  add(index, v) {
    return this.set(index, this.get(index, this.tempPrimitive).add(v));
  }
}
function makeVector2View(dataArray, floatStride = -1, floatOffset = -1) {
  return new Vector2View(dataArray, floatStride, floatOffset);
}
function makeVector3View(dataArray, floatStride = -1, floatOffset = -1) {
  return new Vector3View(dataArray, floatStride, floatOffset);
}
function makeQuaternionView(dataArray, floatStride = -1, floatOffset = -1) {
  return new PrimitiveView(dataArray, 4, floatStride, floatOffset);
}
function makeMatrix3View(dataArray, floatStride = -1, floatOffset = -1) {
  return new PrimitiveView(dataArray, 9, floatStride, floatOffset);
}
function makeMatrix4View(dataArray, floatStride = -1, floatOffset = -1) {
  return new PrimitiveView(dataArray, 16, floatStride, floatOffset);
}

function transformPoint3(v, m, result = new Vector3()) {
  const { x } = v;
  const { y } = v;
  const { z } = v;
  const e = m.elements;
  const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
  result.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
  result.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
  result.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
  return result;
}
function transformNormal3(v, m, result = new Vector3()) {
  const { x } = v;
  const { y } = v;
  const { z } = v;
  const e = m.elements;
  result.x = e[0] * x + e[4] * y + e[8] * z;
  result.y = e[1] * x + e[5] * y + e[9] * z;
  result.z = e[2] * x + e[6] * y + e[10] * z;
  return result.normalize();
}

var PrimitiveType;
(function (PrimitiveType) {
  PrimitiveType[(PrimitiveType['Points'] = GL.POINTS)] = 'Points';
  PrimitiveType[(PrimitiveType['Lines'] = GL.LINES)] = 'Lines';
  PrimitiveType[(PrimitiveType['LineStrip'] = GL.LINE_STRIP)] = 'LineStrip';
  PrimitiveType[(PrimitiveType['Triangles'] = GL.TRIANGLES)] = 'Triangles';
  PrimitiveType[(PrimitiveType['TriangleFan'] = GL.TRIANGLE_FAN)] =
    'TriangleFan';
  PrimitiveType[(PrimitiveType['TriangleStrip'] = GL.TRIANGLE_STRIP)] =
    'TriangleStrip';
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

function copyBytesUsingStride(
  dest,
  source,
  bytesPerVertex,
  byteStridePerVertex,
  attributeOffset
) {
  const destBytes = new Int8Array(dest);
  const sourceBytes = new Int8Array(source);
  const vertexCount = source.byteLength / bytesPerVertex;
  for (let v = 0; v < vertexCount; v++) {
    const sourceOffset = v * bytesPerVertex;
    const destOffset = v * byteStridePerVertex + attributeOffset;
    for (let i = 0; i < bytesPerVertex; i++) {
      destBytes[destOffset + i] = sourceBytes[sourceOffset + i];
    }
  }
}
function convertToInterleavedGeometry(geometry) {
  let byteStridePerVertex = 0;
  let vertexCount = 0;
  for (const name in geometry.attributes) {
    const attribute = geometry.attributes[name];
    if (attribute !== undefined) {
      byteStridePerVertex += Math.max(attribute.bytesPerVertex, 4);
      vertexCount = attribute.count;
    }
  }
  const interleavedArray = new ArrayBuffer(byteStridePerVertex * vertexCount);
  const interleavedData = new AttributeData(interleavedArray);
  const interleavedGeometry = new Geometry();
  interleavedGeometry.indices = geometry.indices;
  let byteOffset = 0;
  for (const name in geometry.attributes) {
    const attribute = geometry.attributes[name];
    if (attribute !== undefined) {
      copyBytesUsingStride(
        interleavedArray,
        attribute.attributeData.arrayBuffer,
        attribute.bytesPerVertex,
        byteStridePerVertex,
        byteOffset
      );
      interleavedGeometry.attributes[name] = new Attribute(
        interleavedData,
        attribute.componentsPerVertex,
        attribute.componentType,
        byteStridePerVertex,
        byteOffset,
        attribute.normalized
      );
      byteOffset += Math.max(attribute.bytesPerVertex, 4);
    }
  }
  return interleavedGeometry;
}
function computeVertexNormals(geometry) {
  const indicesAttribute = geometry.indices;
  const { attributes } = geometry;
  const positionAttribute = attributes.position;
  if (positionAttribute === undefined) {
    throw new Error('missing position attribute');
  }
  let normalAttribute = attributes.normal;
  if (normalAttribute === undefined) {
    normalAttribute = makeFloat32Attribute(
      new Float32Array(positionAttribute.count * 3),
      3
    );
    geometry.attributes.normal = normalAttribute;
  }
  const positions = makeVector3View(positionAttribute);
  const normals = makeVector3View(normalAttribute);
  for (let i = 0, il = normals.count; i < il; i++) {
    normals.set(i, new Vector3());
  }
  const pA = new Vector3();
  const pB = new Vector3();
  const pC = new Vector3();
  const cb = new Vector3();
  const ab = new Vector3();
  if (indicesAttribute !== undefined) {
    const indices = new Uint32Array(indicesAttribute.attributeData.arrayBuffer);
    for (let i = 0, il = indices.length; i < il; i += 3) {
      const vA = indices[i + 0];
      const vB = indices[i + 1];
      const vC = indices[i + 2];
      positions.get(vA, pA);
      positions.get(vB, pB);
      positions.get(vC, pC);
      cb.copy(pC).sub(pB);
      ab.copy(pA).sub(pB);
      cb.cross(ab);
      normals.add(vA, cb);
      normals.add(vB, cb);
      normals.add(vC, cb);
    }
  } else {
    for (let i = 0, il = positions.count; i < il; i += 3) {
      positions.get(i, pA);
      positions.get(i + 1, pB);
      positions.get(i + 2, pC);
      cb.copy(pC).sub(pB);
      ab.copy(pA).sub(pB);
      cb.cross(ab);
      normals.add(i, cb);
      normals.add(i + 1, cb);
      normals.add(i + 2, cb);
    }
  }
  const v = new Vector3();
  for (let i = 0, il = normals.count; i < il; i += 3) {
    normals.set(i, normals.get(i, v).normalize());
  }
}
function transformGeometry(geometry, m) {
  const positionAttribute = geometry.attributes.position;
  if (positionAttribute === undefined) {
    throw new Error('missing position attribute');
  }
  const positions = makeVector3View(positionAttribute);
  const v = new Vector3();
  for (let i = 0; i < positions.count; i++) {
    positions.get(i, v);
    transformPoint3(v, m, v);
    positions.set(i, v);
  }
  const normalAttribute = geometry.attributes.normal;
  if (normalAttribute !== undefined) {
    const normals = makeVector3View(normalAttribute);
    for (let i = 0; i < normals.count; i++) {
      normals.get(i, v);
      transformNormal3(v, m, v);
      normals.set(i, v);
    }
  }
}

function planeGeometry(
  width = 1,
  height = 1,
  widthSegments = 1,
  heightSegments = 1
) {
  const widthHalf = width / 2;
  const heightHalf = height / 2;
  const gridX = Math.floor(widthSegments);
  const gridY = Math.floor(heightSegments);
  const gridX1 = gridX + 1;
  const gridY1 = gridY + 1;
  const segmentWidth = width / gridX;
  const segmentHeight = height / gridY;
  const indices = [];
  const vertices = [];
  const normals = [];
  const uvs = [];
  for (let iy = 0; iy < gridY1; iy++) {
    const y = iy * segmentHeight - heightHalf;
    for (let ix = 0; ix < gridX1; ix++) {
      const x = ix * segmentWidth - widthHalf;
      vertices.push(x, -y, 0);
      normals.push(0, 0, 1);
      uvs.push(ix / gridX, iy / gridY);
    }
  }
  for (let iy = 0; iy < gridY; iy++) {
    for (let ix = 0; ix < gridX; ix++) {
      const a = ix + gridX1 * iy;
      const b = ix + gridX1 * (iy + 1);
      const c = ix + 1 + gridX1 * (iy + 1);
      const d = ix + 1 + gridX1 * iy;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }
  const geometry = new Geometry();
  geometry.indices = makeUint32Attribute(indices);
  geometry.attributes.position = makeFloat32Attribute(vertices, 3);
  geometry.attributes.normal = makeFloat32Attribute(normals, 3);
  geometry.attributes.uv = makeFloat32Attribute(uvs, 2);
  return geometry;
}

var Blending;
(function (Blending) {
  Blending[(Blending['Over'] = 0)] = 'Over';
  Blending[(Blending['Add'] = 1)] = 'Add';
  Blending[(Blending['Subtract'] = 2)] = 'Subtract';
  Blending[(Blending['Multiply'] = 3)] = 'Multiply';
})(Blending || (Blending = {}));

class ShaderMaterial {
  constructor(vertexShaderCode, fragmentShaderCode, glslVersion = 200) {
    this.vertexShaderCode = vertexShaderCode;
    this.fragmentShaderCode = fragmentShaderCode;
    this.glslVersion = glslVersion;
    this.uuid = generateUUID();
    this.version = 0;
    this.disposed = false;
    this.name = '';
  }
  dirty() {
    this.version++;
  }
  dispose() {
    this.disposed = true;
    this.dirty();
  }
}

function isMacOS() {
  return /(Mac)/i.test(navigator.platform);
}
function isiOS() {
  return /(iPhone|iPod|iPad)/i.test(navigator.platform);
}
function isFirefox() {
  return /(Gecko\/)/i.test(navigator.userAgent);
}

var BlendEquation;
(function (BlendEquation) {
  BlendEquation[(BlendEquation['Add'] = GL.FUNC_ADD)] = 'Add';
  BlendEquation[(BlendEquation['Subtract'] = GL.FUNC_SUBTRACT)] = 'Subtract';
  BlendEquation[(BlendEquation['ReverseSubtract'] = GL.FUNC_REVERSE_SUBTRACT)] =
    'ReverseSubtract';
})(BlendEquation || (BlendEquation = {}));
var BlendFunc;
(function (BlendFunc) {
  BlendFunc[(BlendFunc['Zero'] = GL.ZERO)] = 'Zero';
  BlendFunc[(BlendFunc['One'] = GL.ONE)] = 'One';
  BlendFunc[(BlendFunc['SourceColor'] = GL.SRC_COLOR)] = 'SourceColor';
  BlendFunc[(BlendFunc['OneMinusSourceColor'] = GL.ONE_MINUS_SRC_COLOR)] =
    'OneMinusSourceColor';
  BlendFunc[(BlendFunc['DestColor'] = GL.DST_COLOR)] = 'DestColor';
  BlendFunc[(BlendFunc['OneMinusDestColor'] = GL.ONE_MINUS_DST_COLOR)] =
    'OneMinusDestColor';
  BlendFunc[(BlendFunc['SourceAlpha'] = GL.SRC_ALPHA)] = 'SourceAlpha';
  BlendFunc[(BlendFunc['OneMinusSourceAlpha'] = GL.ONE_MINUS_SRC_ALPHA)] =
    'OneMinusSourceAlpha';
  BlendFunc[(BlendFunc['DestAlpha'] = GL.DST_ALPHA)] = 'DestAlpha';
  BlendFunc[(BlendFunc['OneMinusDestAlpha'] = GL.ONE_MINUS_DST_ALPHA)] =
    'OneMinusDestAlpha';
  BlendFunc[(BlendFunc['ConstantColor'] = GL.CONSTANT_COLOR)] = 'ConstantColor';
  BlendFunc[
    (BlendFunc['OneMinusConstantColor'] = GL.ONE_MINUS_CONSTANT_COLOR)
  ] = 'OneMinusConstantColor';
  BlendFunc[(BlendFunc['ConstantAlpha'] = GL.CONSTANT_ALPHA)] = 'ConstantAlpha';
  BlendFunc[
    (BlendFunc['OneMinusConstantAlpha'] = GL.ONE_MINUS_CONSTANT_ALPHA)
  ] = 'OneMinusConstantAlpha';
  BlendFunc[(BlendFunc['SourceAlphaSaturate'] = GL.SRC_ALPHA_SATURATE)] =
    'SourceAlphaSaturate';
})(BlendFunc || (BlendFunc = {}));
class BlendState {
  constructor(
    sourceRGBFactor = BlendFunc.One,
    destRGBFactor = BlendFunc.Zero,
    sourceAlphaFactor = BlendFunc.One,
    destAlphaFactor = BlendFunc.Zero,
    equation = BlendEquation.Add
  ) {
    this.sourceRGBFactor = sourceRGBFactor;
    this.destRGBFactor = destRGBFactor;
    this.sourceAlphaFactor = sourceAlphaFactor;
    this.destAlphaFactor = destAlphaFactor;
    this.equation = equation;
  }
  clone() {
    return new BlendState(
      this.sourceRGBFactor,
      this.destRGBFactor,
      this.sourceAlphaFactor,
      this.destAlphaFactor,
      this.equation
    );
  }
  copy(bs) {
    this.sourceRGBFactor = bs.sourceRGBFactor;
    this.destRGBFactor = bs.destRGBFactor;
    this.sourceAlphaFactor = bs.sourceAlphaFactor;
    this.destAlphaFactor = bs.destAlphaFactor;
    this.equation = bs.equation;
  }
  equals(bs) {
    return (
      this.sourceRGBFactor === bs.sourceRGBFactor &&
      this.destRGBFactor === bs.destRGBFactor &&
      this.sourceAlphaFactor === bs.sourceAlphaFactor &&
      this.destAlphaFactor === bs.destAlphaFactor &&
      this.equation === bs.equation
    );
  }
}
function blendModeToBlendState(blending, premultiplied = true) {
  if (premultiplied) {
    switch (blending) {
      case Blending.Over:
        return new BlendState(
          BlendFunc.One,
          BlendFunc.OneMinusSourceAlpha,
          BlendFunc.One,
          BlendFunc.OneMinusSourceAlpha
        );
      case Blending.Add:
        return new BlendState(
          BlendFunc.One,
          BlendFunc.One,
          BlendFunc.One,
          BlendFunc.One
        );
      case Blending.Subtract:
        return new BlendState(
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceAlpha,
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceAlpha
        );
      case Blending.Multiply:
        return new BlendState(
          BlendFunc.Zero,
          BlendFunc.SourceColor,
          BlendFunc.Zero,
          BlendFunc.SourceAlpha
        );
    }
  } else {
    switch (blending) {
      case Blending.Over:
        return new BlendState(
          BlendFunc.SourceAlpha,
          BlendFunc.OneMinusSourceAlpha,
          BlendFunc.One,
          BlendFunc.OneMinusSourceAlpha
        );
      case Blending.Add:
        return new BlendState(
          BlendFunc.SourceAlpha,
          BlendFunc.One,
          BlendFunc.One,
          BlendFunc.One
        );
      case Blending.Subtract:
        return new BlendState(
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceAlpha,
          BlendFunc.Zero,
          BlendFunc.OneMinusSourceAlpha
        );
      case Blending.Multiply:
        return new BlendState(
          BlendFunc.Zero,
          BlendFunc.SourceColor,
          BlendFunc.Zero,
          BlendFunc.SourceColor
        );
    }
  }
}

class UserResource {
  constructor(user, resource) {
    this.user = user;
    this.resource = resource;
    this.resourceVersion = -1;
  }
  update(context, updater) {
    let disposed = false;
    if (this.resourceVersion < this.user.version) {
      if (this.user.disposed) {
        this.resource.dispose();
        disposed = true;
      } else {
        this.resource = updater(context, this.user, this.resource);
      }
      this.resourceVersion = this.user.version;
    }
    return disposed;
  }
}
class Pool {
  constructor(context, updater) {
    this.context = context;
    this.updater = updater;
    this.userResources = [];
  }
  request(user) {
    let userResource = this.userResources.find(
      (userResource) => userResource.user.uuid === user.uuid
    );
    if (userResource === undefined) {
      userResource = new UserResource(
        user,
        this.updater(this.context, user, undefined)
      );
      this.userResources.push(userResource);
    }
    return userResource.resource;
  }
  update() {
    let disposeCount = 0;
    this.userResources.forEach((userResource) => {
      if (userResource.update(this.context, this.updater)) {
        disposeCount++;
      }
    });
    if (disposeCount > 0) {
      this.garbageCollect();
    }
    return this;
  }
  garbageCollect() {
    this.userResources = this.userResources.filter(
      (userResource) => !userResource.resource.disposed
    );
    return this;
  }
}

var BufferUsage;
(function (BufferUsage) {
  BufferUsage[(BufferUsage['StaticDraw'] = GL.STATIC_DRAW)] = 'StaticDraw';
  BufferUsage[(BufferUsage['DynamicDraw'] = GL.DYNAMIC_DRAW)] = 'DynamicDraw';
})(BufferUsage || (BufferUsage = {}));

class Buffer$1 {
  constructor(
    context,
    arrayBuffer,
    target = BufferTarget.Array,
    usage = BufferUsage.StaticDraw
  ) {
    this.context = context;
    this.target = target;
    this.usage = usage;
    this.disposed = false;
    const { gl } = context;
    {
      const glBuffer = gl.createBuffer();
      if (glBuffer === null) {
        throw new Error('createBuffer failed');
      }
      this.glBuffer = glBuffer;
    }
    gl.bindBuffer(this.target, this.glBuffer);
    gl.bufferData(this.target, arrayBuffer, this.usage);
    this.id = this.context.registerResource(this);
  }
  update(
    arrayBuffer,
    target = BufferTarget.Array,
    usage = BufferUsage.StaticDraw
  ) {
    this.target = target;
    this.usage = usage;
    const { gl } = this.context;
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
class BufferPool extends Pool {
  constructor(context) {
    super(context, (context, attribute, buffer) => {
      if (buffer === undefined) {
        return new Buffer$1(context, attribute.arrayBuffer, attribute.target);
      }
      buffer.update(attribute.arrayBuffer, attribute.target);
      return buffer;
    });
  }
}

class BufferAccessor {
  constructor(
    buffer,
    componentType,
    componentsPerVertex,
    normalized,
    vertexStride,
    byteOffset
  ) {
    this.buffer = buffer;
    this.componentType = componentType;
    this.componentsPerVertex = componentsPerVertex;
    this.normalized = normalized;
    this.vertexStride = vertexStride;
    this.byteOffset = byteOffset;
  }
}
function makeBufferAccessorFromAttribute(
  context,
  attribute,
  bufferTarget = undefined
) {
  const { attributeData } = attribute;
  const target =
    bufferTarget !== undefined ? bufferTarget : attributeData.target;
  const buffer = new Buffer$1(context, attributeData.arrayBuffer, target);
  const bufferAccessor = new BufferAccessor(
    buffer,
    attribute.componentType,
    attribute.componentsPerVertex,
    attribute.normalized,
    attribute.vertexStride,
    attribute.byteOffset
  );
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
    console.warn(
      'This is not safe.  The buffers may be used by multiple bufferViews & bufferGeometries.'
    );
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
    bufferGeometry.indices = makeBufferAccessorFromAttribute(
      context,
      geometry.indices,
      BufferTarget.ElementArray
    );
    bufferGeometry.count = geometry.indices.count;
  }
  for (const name in geometry.attributes) {
    const attribute = geometry.attributes[name];
    if (attribute !== undefined) {
      bufferGeometry.bufferAccessors[name] = makeBufferAccessorFromAttribute(
        context,
        attribute
      );
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
    return (
      this.color.equals(cs.color) &&
      this.alpha === cs.alpha &&
      this.depth === cs.depth &&
      this.stencil === cs.stencil
    );
  }
}

var Attachment;
(function (Attachment) {
  Attachment[(Attachment['Color0'] = GL.COLOR_ATTACHMENT0)] = 'Color0';
  Attachment[(Attachment['Depth'] = GL.DEPTH_ATTACHMENT)] = 'Depth';
  Attachment[(Attachment['DepthStencil'] = GL.DEPTH_STENCIL_ATTACHMENT)] =
    'DepthStencil';
  Attachment[(Attachment['Stencil'] = GL.STENCIL_ATTACHMENT)] = 'Stencil';
})(Attachment || (Attachment = {}));

class Box2 {
  constructor(
    min = new Vector2(+Infinity, +Infinity),
    max = new Vector2(+Infinity, +Infinity)
  ) {
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
    return v.set(
      (this.min.x + this.max.x) * 0.5,
      (this.min.y + this.max.y) * 0.5
    );
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
  BufferBit[(BufferBit['None'] = 0)] = 'None';
  BufferBit[(BufferBit['Color'] = GL.COLOR_BUFFER_BIT)] = 'Color';
  BufferBit[(BufferBit['Depth'] = GL.DEPTH_BUFFER_BIT)] = 'Depth';
  BufferBit[(BufferBit['Stencil'] = GL.STENCIL_BUFFER_BIT)] = 'Stencil';
  BufferBit[(BufferBit['Default'] = BufferBit.Color | BufferBit.Depth)] =
    'Default';
  BufferBit[
    (BufferBit['All'] = BufferBit.Color | BufferBit.Depth | BufferBit.Stencil)
  ] = 'All';
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
  clear(
    attachmentBits = BufferBit.Color | BufferBit.Depth,
    clearState = undefined
  ) {
    this.context.framebuffer = this;
    this.context.clearState =
      clearState ?? this.clearState ?? this.context.clearState;
    const { gl } = this.context;
    gl.clear(attachmentBits);
  }
  render(node, camera, clear = false) {
    this.context.framebuffer = this;
    if (clear) {
      this.clear();
    }
    throw new Error('Not implemented');
  }
  flush() {
    this.context.gl.flush();
  }
  finish() {
    this.context.gl.finish();
  }
}
function renderBufferGeometry(
  framebuffer,
  program,
  uniforms,
  bufferGeometry,
  depthTestState = undefined,
  blendState = undefined,
  maskState = undefined,
  cullingState = undefined
) {
  const { context } = framebuffer;
  context.framebuffer = framebuffer;
  context.blendState =
    blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState =
    depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState =
    cullingState ?? framebuffer.cullingState ?? context.cullingState;
  context.program = program;
  context.program.setUniformValues(uniforms);
  context.program.setAttributeBuffers(bufferGeometry);
  context.viewport = new Box2(new Vector2(), framebuffer.size);
  const { gl } = context;
  if (bufferGeometry.indices !== undefined) {
    gl.drawElements(
      bufferGeometry.primitive,
      bufferGeometry.count,
      bufferGeometry.indices.componentType,
      0
    );
  } else {
    gl.drawArrays(bufferGeometry.primitive, 0, bufferGeometry.count);
  }
}
function renderVertexArrayObject(
  framebuffer,
  program,
  uniforms,
  vao,
  depthTestState = undefined,
  blendState = undefined,
  maskState = undefined,
  cullingState = undefined
) {
  const { context } = framebuffer;
  context.framebuffer = framebuffer;
  context.blendState =
    blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState =
    depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState =
    cullingState ?? framebuffer.cullingState ?? context.cullingState;
  context.program = program;
  context.program.setUniformValues(uniforms);
  context.viewport = new Box2(new Vector2(), framebuffer.size);
  const { gl } = context;
  gl.drawArrays(vao.primitive, vao.offset, vao.count);
}
function renderPass(
  framebuffer,
  program,
  uniforms,
  depthTestState = undefined,
  blendState = undefined,
  maskState = undefined,
  cullingState = undefined
) {
  const { context } = framebuffer;
  context.framebuffer = framebuffer;
  context.blendState =
    blendState ?? framebuffer.blendState ?? context.blendState;
  context.depthTestState =
    depthTestState ?? framebuffer.depthTestState ?? context.depthTestState;
  context.maskState = maskState ?? framebuffer.maskState ?? context.maskState;
  context.cullingState =
    cullingState ?? framebuffer.cullingState ?? context.cullingState;
  context.program = program;
  context.program.setUniformValues(uniforms);
  context.viewport = new Box2(new Vector2(), framebuffer.size);
  throw new Error('Not implemented');
}

var __classPrivateFieldGet$6 =
  (undefined && undefined.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a getter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      );
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var _Framebuffer_size;
class Framebuffer extends VirtualFramebuffer {
  constructor(context) {
    super(context);
    _Framebuffer_size.set(this, new Vector2());
    this._attachments = {};
    const { gl } = this.context;
    {
      const glFramebuffer = gl.createFramebuffer();
      if (glFramebuffer === null) {
        throw new Error('createFramebuffer failed');
      }
      this.glFramebuffer = glFramebuffer;
    }
    this.id = this.context.registerResource(this);
  }
  attach(attachmentPoint, texImage2D, target = texImage2D.target, level = 0) {
    const { gl } = this.context;
    gl.bindFramebuffer(GL.FRAMEBUFFER, this.glFramebuffer);
    gl.framebufferTexture2D(
      GL.FRAMEBUFFER,
      attachmentPoint,
      target,
      texImage2D.glTexture,
      level
    );
    this._attachments[attachmentPoint] = texImage2D;
    this.size.copy(texImage2D.size);
    gl.bindFramebuffer(GL.FRAMEBUFFER, null);
  }
  getAttachment(attachmentPoint) {
    return this._attachments[attachmentPoint];
  }
  get size() {
    return __classPrivateFieldGet$6(this, _Framebuffer_size, 'f');
  }
  dispose() {
    if (!this.disposed) {
      const { gl } = this.context;
      gl.deleteFramebuffer(this.glFramebuffer);
      this.context.disposeResource(this);
      this.disposed = true;
    }
  }
}
_Framebuffer_size = new WeakMap();

var ShaderType;
(function (ShaderType) {
  ShaderType[(ShaderType['Fragment'] = GL.FRAGMENT_SHADER)] = 'Fragment';
  ShaderType[(ShaderType['Vertex'] = GL.VERTEX_SHADER)] = 'Vertex';
})(ShaderType || (ShaderType = {}));

var __classPrivateFieldGet$5 =
  (undefined && undefined.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a getter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      );
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var __classPrivateFieldSet$5 =
  (undefined && undefined.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a setter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it'
      );
    return (
      kind === 'a'
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var _Shader_validated;
function insertLineNumbers(source) {
  const inputLines = source.split('\n');
  const outputLines = ['\n'];
  const maxLineCharacters = Math.floor(Math.log10(inputLines.length));
  for (let l = 0; l < inputLines.length; l++) {
    const lAsString = `000000${l + 1}`.slice(-maxLineCharacters - 1);
    outputLines.push(`${lAsString}: ${inputLines[l]}`);
  }
  return outputLines.join('\n');
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
  source.split('\n').forEach((line) => {
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
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')
    .replace(/[\r\n]+/g, '\n');
}
class Shader {
  constructor(context, source, shaderType, glslVersion = 300) {
    this.context = context;
    this.source = source;
    this.shaderType = shaderType;
    this.glslVersion = glslVersion;
    this.disposed = false;
    _Shader_validated.set(this, false);
    const { gl } = this.context;
    {
      const glShader = gl.createShader(shaderType);
      if (glShader === null) {
        throw new Error('createShader failed');
      }
      this.glShader = glShader;
    }
    const prefix = [];
    if (glslVersion === 300) {
      prefix.push('#version 300 es');
    }
    if (shaderType === ShaderType.Fragment) {
      const { glxo } = context;
      if (glxo.EXT_shader_texture_lod !== null) {
        prefix.push('#extension GL_EXT_shader_texture_lod : enable');
      }
      prefix.push('#extension GL_OES_standard_derivatives : enable');
    }
    const combinedSource = `${prefix.join('\n')}\n${source}`;
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
    return '';
  }
  validate() {
    if (
      __classPrivateFieldGet$5(this, _Shader_validated, 'f') ||
      this.disposed
    ) {
      return;
    }
    const { gl } = this.context;
    const compileStatus = gl.getShaderParameter(
      this.glShader,
      GL.COMPILE_STATUS
    );
    if (!compileStatus) {
      const infoLog = gl.getShaderInfoLog(this.glShader);
      const errorMessage = `could not compile shader:\n${infoLog}`;
      console.error(errorMessage);
      console.error(insertLineNumbers(this.finalSource));
      this.disposed = true;
      throw new Error(errorMessage);
    }
    __classPrivateFieldSet$5(this, _Shader_validated, true, 'f');
  }
  dispose() {
    if (!this.disposed) {
      this.context.gl.deleteShader(this.glShader);
      this.context.disposeResource(this);
      this.disposed = true;
    }
  }
}
_Shader_validated = new WeakMap();

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
        throw new Error('createVertexArray failed');
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
    const { gl } = program.context;
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
    const { gl } = this.program.context;
    gl.enableVertexAttribArray(this.glLocation);
    gl.bindBuffer(GL.ARRAY_BUFFER, bufferAccessor.buffer.glBuffer);
    gl.vertexAttribPointer(
      this.glLocation,
      bufferAccessor.componentsPerVertex,
      bufferAccessor.componentType,
      bufferAccessor.normalized,
      bufferAccessor.vertexStride,
      bufferAccessor.byteOffset
    );
    return this;
  }
}

function linearizeNumberInt32Array(array) {
  const result = new Int32Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = array[i];
  }
  return result;
}
function linearizeNumberFloatArray(array) {
  const result = new Float32Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = array[i];
  }
  return result;
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
function linearizeQuaternionFloatArray(array) {
  const result = new Float32Array(array.length * 4);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 4);
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
  DataType[(DataType['Byte'] = GL.BYTE)] = 'Byte';
  DataType[(DataType['UnsignedByte'] = GL.UNSIGNED_BYTE)] = 'UnsignedByte';
  DataType[(DataType['Short'] = GL.SHORT)] = 'Short';
  DataType[(DataType['UnsignedShort'] = GL.UNSIGNED_SHORT)] = 'UnsignedShort';
  DataType[(DataType['Int'] = GL.INT)] = 'Int';
  DataType[(DataType['UnsignedInt'] = GL.UNSIGNED_INT)] = 'UnsignedInt';
  DataType[(DataType['Float'] = GL.FLOAT)] = 'Float';
})(DataType || (DataType = {}));
function sizeOfDataType(dataType) {
  switch (dataType) {
    case DataType.Byte:
    case DataType.UnsignedByte:
      return 1;
    case DataType.Short:
    case DataType.UnsignedShort:
      return 2;
    case DataType.Int:
    case DataType.UnsignedInt:
    case DataType.Float:
      return 5;
  }
  throw new Error(`unsupported data type: ${dataType}`);
}

var PixelEncoding;
(function (PixelEncoding) {
  PixelEncoding[(PixelEncoding['Linear'] = 0)] = 'Linear';
  PixelEncoding[(PixelEncoding['sRGB'] = 1)] = 'sRGB';
  PixelEncoding[(PixelEncoding['RGBE'] = 2)] = 'RGBE';
  PixelEncoding[(PixelEncoding['RGBD'] = 3)] = 'RGBD';
})(PixelEncoding || (PixelEncoding = {}));

class ArrayBufferImage {
  constructor(
    data,
    width,
    height,
    dataType = DataType.UnsignedByte,
    pixelEncoding = PixelEncoding.sRGB
  ) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.dataType = dataType;
    this.pixelEncoding = pixelEncoding;
  }
}

var PixelFormat;
(function (PixelFormat) {
  PixelFormat[(PixelFormat['RGBA'] = GL.RGBA)] = 'RGBA';
  PixelFormat[(PixelFormat['RGB'] = GL.RGB)] = 'RGB';
  PixelFormat[(PixelFormat['LuminanceAlpha'] = GL.LUMINANCE_ALPHA)] =
    'LuminanceAlpha';
  PixelFormat[(PixelFormat['Luminance'] = GL.LUMINANCE)] = 'Luminance';
  PixelFormat[(PixelFormat['Alpha'] = GL.ALPHA)] = 'Alpha';
  PixelFormat[(PixelFormat['DepthComponent'] = GL.DEPTH_COMPONENT)] =
    'DepthComponent';
  PixelFormat[(PixelFormat['DepthStencil'] = GL.DEPTH_STENCIL)] =
    'DepthStencil';
})(PixelFormat || (PixelFormat = {}));
function numPixelFormatComponents(pixelFormat) {
  switch (pixelFormat) {
    case PixelFormat.Alpha:
    case PixelFormat.Luminance:
    case PixelFormat.DepthComponent:
      return 1;
    case PixelFormat.LuminanceAlpha:
    case PixelFormat.DepthStencil:
      return 2;
    case PixelFormat.RGB:
      return 3;
    case PixelFormat.RGBA:
      return 4;
  }
  throw new Error(`unsupported pixel format: ${pixelFormat}`);
}

var TextureFilter;
(function (TextureFilter) {
  TextureFilter[
    (TextureFilter['LinearMipmapLinear'] = GL.LINEAR_MIPMAP_LINEAR)
  ] = 'LinearMipmapLinear';
  TextureFilter[
    (TextureFilter['LinearMipmapNearest'] = GL.LINEAR_MIPMAP_NEAREST)
  ] = 'LinearMipmapNearest';
  TextureFilter[(TextureFilter['Linear'] = GL.LINEAR)] = 'Linear';
  TextureFilter[(TextureFilter['Nearest'] = GL.NEAREST)] = 'Nearest';
  TextureFilter[
    (TextureFilter['NearestMipmapLinear'] = GL.NEAREST_MIPMAP_LINEAR)
  ] = 'NearestMipmapLinear';
  TextureFilter[
    (TextureFilter['NearestMipmapNearest'] = GL.NEAREST_MIPMAP_NEAREST)
  ] = 'NearestMipmapNearest';
})(TextureFilter || (TextureFilter = {}));

var TextureWrap;
(function (TextureWrap) {
  TextureWrap[(TextureWrap['MirroredRepeat'] = GL.MIRRORED_REPEAT)] =
    'MirroredRepeat';
  TextureWrap[(TextureWrap['ClampToEdge'] = GL.CLAMP_TO_EDGE)] = 'ClampToEdge';
  TextureWrap[(TextureWrap['Repeat'] = GL.REPEAT)] = 'Repeat';
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
  TextureTarget[(TextureTarget['Texture2D'] = GL.TEXTURE_2D)] = 'Texture2D';
  TextureTarget[(TextureTarget['TextureCubeMap'] = GL.TEXTURE_CUBE_MAP)] =
    'TextureCubeMap';
  TextureTarget[
    (TextureTarget['CubeMapPositiveX'] = GL.TEXTURE_CUBE_MAP_POSITIVE_X)
  ] = 'CubeMapPositiveX';
  TextureTarget[
    (TextureTarget['CubeMapNegativeX'] = GL.TEXTURE_CUBE_MAP_NEGATIVE_X)
  ] = 'CubeMapNegativeX';
  TextureTarget[
    (TextureTarget['CubeMapPositiveY'] = GL.TEXTURE_CUBE_MAP_POSITIVE_Y)
  ] = 'CubeMapPositiveY';
  TextureTarget[
    (TextureTarget['CubeMapNegativeY'] = GL.TEXTURE_CUBE_MAP_NEGATIVE_Y)
  ] = 'CubeMapNegativeY';
  TextureTarget[
    (TextureTarget['CubeMapPositiveZ'] = GL.TEXTURE_CUBE_MAP_POSITIVE_Z)
  ] = 'CubeMapPositiveZ';
  TextureTarget[
    (TextureTarget['CubeMapNegativeZ'] = GL.TEXTURE_CUBE_MAP_NEGATIVE_Z)
  ] = 'CubeMapNegativeZ';
})(TextureTarget || (TextureTarget = {}));

class TexImage2D {
  constructor(
    context,
    images,
    internalFormat = PixelFormat.RGBA,
    dataType = DataType.UnsignedByte,
    pixelFormat = PixelFormat.RGBA,
    target = TextureTarget.Texture2D,
    texParameters = new TexParameters()
  ) {
    this.context = context;
    this.images = images;
    this.internalFormat = internalFormat;
    this.dataType = dataType;
    this.pixelFormat = pixelFormat;
    this.target = target;
    this.texParameters = texParameters;
    this.disposed = false;
    this.size = new Vector2();
    const { gl } = this.context;
    {
      const glTexture = gl.createTexture();
      if (glTexture === null) {
        throw new Error('createTexture failed');
      }
      this.glTexture = glTexture;
    }
    this.loadImages(images);
    gl.texParameteri(this.target, GL.TEXTURE_WRAP_S, texParameters.wrapS);
    gl.texParameteri(this.target, GL.TEXTURE_WRAP_T, texParameters.wrapS);
    gl.texParameteri(
      this.target,
      GL.TEXTURE_MAG_FILTER,
      texParameters.magFilter
    );
    gl.texParameteri(
      this.target,
      GL.TEXTURE_MIN_FILTER,
      texParameters.minFilter
    );
    if (texParameters.anisotropyLevels > 1) {
      const tfa = this.context.glxo.EXT_texture_filter_anisotropic;
      if (tfa !== null) {
        const maxAllowableAnisotropy = gl.getParameter(
          tfa.MAX_TEXTURE_MAX_ANISOTROPY_EXT
        );
        gl.texParameterf(
          this.target,
          tfa.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(texParameters.anisotropyLevels, maxAllowableAnisotropy)
        );
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
    const { gl } = this.context;
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
    const { gl } = this.context;
    gl.bindTexture(this.target, this.glTexture);
    if (images.length === 1) {
      this.loadImage(images[0]);
    } else if (this.target === TextureTarget.TextureCubeMap) {
      const numLevels = Math.floor(this.images.length / 6);
      for (let level = 0; level < numLevels; level++) {
        for (let face = 0; face < 6; face++) {
          const imageIndex = level * 6 + face;
          const image = images[imageIndex];
          this.loadImage(image, TextureTarget.CubeMapPositiveX + face, level);
        }
      }
    } else {
      throw new Error('Unsupported number of images');
    }
  }
  loadImage(image, target = undefined, level = 0) {
    const { gl } = this.context;
    if (image instanceof Vector2) {
      gl.texImage2D(
        target ?? this.target,
        level,
        this.internalFormat,
        image.width,
        image.height,
        0,
        this.pixelFormat,
        this.dataType,
        null
      );
      if (level === 0) {
        this.size.set(image.width, image.height);
      }
    } else if (image instanceof ArrayBufferImage) {
      gl.texImage2D(
        target ?? this.target,
        level,
        this.internalFormat,
        image.width,
        image.height,
        0,
        this.pixelFormat,
        this.dataType,
        new Uint8Array(image.data)
      );
      if (level === 0) {
        this.size.set(image.width, image.height);
      }
    } else {
      gl.texImage2D(
        target ?? this.target,
        level,
        this.internalFormat,
        this.pixelFormat,
        this.dataType,
        image
      );
      this.size.set(image.width, image.height);
    }
  }
}

var UniformType;
(function (UniformType) {
  UniformType[(UniformType['Bool'] = GL.BOOL)] = 'Bool';
  UniformType[(UniformType['BoolVec2'] = GL.BOOL_VEC2)] = 'BoolVec2';
  UniformType[(UniformType['BoolVec3'] = GL.BOOL_VEC3)] = 'BoolVec3';
  UniformType[(UniformType['BoolVec4'] = GL.BOOL_VEC4)] = 'BoolVec4';
  UniformType[(UniformType['Int'] = GL.INT)] = 'Int';
  UniformType[(UniformType['IntVec2'] = GL.INT_VEC2)] = 'IntVec2';
  UniformType[(UniformType['IntVec3'] = GL.INT_VEC3)] = 'IntVec3';
  UniformType[(UniformType['IntVec4'] = GL.INT_VEC4)] = 'IntVec4';
  UniformType[(UniformType['Float'] = GL.FLOAT)] = 'Float';
  UniformType[(UniformType['FloatVec2'] = GL.FLOAT_VEC2)] = 'FloatVec2';
  UniformType[(UniformType['FloatVec3'] = GL.FLOAT_VEC3)] = 'FloatVec3';
  UniformType[(UniformType['FloatVec4'] = GL.FLOAT_VEC4)] = 'FloatVec4';
  UniformType[(UniformType['FloatMat2'] = GL.FLOAT_MAT2)] = 'FloatMat2';
  UniformType[(UniformType['FloatMat3'] = GL.FLOAT_MAT3)] = 'FloatMat3';
  UniformType[(UniformType['FloatMat4'] = GL.FLOAT_MAT4)] = 'FloatMat4';
  UniformType[(UniformType['Sampler2D'] = GL.SAMPLER_2D)] = 'Sampler2D';
  UniformType[(UniformType['SamplerCube'] = GL.SAMPLER_CUBE)] = 'SamplerCube';
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
    const { gl } = program.context;
    {
      const activeInfo = gl.getActiveUniform(program.glProgram, index);
      if (activeInfo === null) {
        throw new Error(`Can not find uniform with index: ${index}`);
      }
      const array1dMatch = activeInfo.name.match(array1dRegexp);
      if (array1dMatch !== null) {
        this.name = array1dMatch[1];
        this.dimensions = 1;
      } else {
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
    const { gl } = this.context;
    switch (this.uniformType) {
      case UniformType.Int:
        if (typeof value === 'number') {
          if (value !== this.valueHashCode) {
            gl.uniform1i(this.glLocation, value);
            this.valueHashCode = value;
          }
          return this;
        }
        if (
          value instanceof Array &&
          value.length > 0 &&
          typeof value[0] === 'number'
        ) {
          gl.uniform1iv(this.glLocation, value);
          this.valueHashCode = -1;
          return this;
        }
        break;
      case UniformType.Float:
        if (typeof value === 'number') {
          if (value !== this.valueHashCode) {
            gl.uniform1f(this.glLocation, value);
            this.valueHashCode = value;
          }
          return this;
        }
        if (
          value instanceof Array &&
          value.length > 0 &&
          typeof value[0] === 'number'
        ) {
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
        if (
          value instanceof Array &&
          value.length > 0 &&
          value[0] instanceof Vector2
        ) {
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
        if (
          value instanceof Array &&
          value.length > 0 &&
          value[0] instanceof Vector3
        ) {
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
        if (
          value instanceof Array &&
          value.length > 0 &&
          value[0] instanceof Matrix4
        ) {
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
        if (
          value instanceof Array &&
          value.length > 0 &&
          value[0] instanceof Matrix4
        ) {
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
    throw new Error(
      `unsupported uniform type - value mismatch: ${
        UniformType[this.uniformType]
      }(${this.uniformType}) on '${this.name}'`
    );
  }
}

var __classPrivateFieldGet$4 =
  (undefined && undefined.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a getter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      );
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var __classPrivateFieldSet$4 =
  (undefined && undefined.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a setter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it'
      );
    return (
      kind === 'a'
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var _Program_validated,
  _Program_uniformsInitialized,
  _Program_uniforms,
  _Program_attributesInitialized,
  _Program_attributes;
class Program {
  constructor(context, vertexShaderCode, fragmentShaderCode, glslVersion) {
    this.context = context;
    this.disposed = false;
    _Program_validated.set(this, false);
    _Program_uniformsInitialized.set(this, false);
    _Program_uniforms.set(this, {});
    _Program_attributesInitialized.set(this, false);
    _Program_attributes.set(this, {});
    this.vertexShader = new Shader(
      this.context,
      vertexShaderCode,
      ShaderType.Vertex,
      glslVersion
    );
    this.fragmentShader = new Shader(
      this.context,
      fragmentShaderCode,
      ShaderType.Fragment,
      glslVersion
    );
    const { gl } = this.context;
    {
      const glProgram = gl.createProgram();
      if (glProgram === null) {
        throw new Error('createProgram failed');
      }
      this.glProgram = glProgram;
    }
    gl.attachShader(this.glProgram, this.vertexShader.glShader);
    gl.attachShader(this.glProgram, this.fragmentShader.glShader);
    gl.linkProgram(this.glProgram);
    this.id = this.context.registerResource(this);
  }
  validate() {
    if (
      __classPrivateFieldGet$4(this, _Program_validated, 'f') ||
      this.disposed
    ) {
      return true;
    }
    const { gl } = this.context;
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
    __classPrivateFieldSet$4(this, _Program_validated, true, 'f');
    return true;
  }
  get uniforms() {
    if (!__classPrivateFieldGet$4(this, _Program_uniformsInitialized, 'f')) {
      let textureUnitCount = 0;
      const { gl } = this.context;
      const numActiveUniforms = gl.getProgramParameter(
        this.glProgram,
        gl.ACTIVE_UNIFORMS
      );
      for (let i = 0; i < numActiveUniforms; ++i) {
        const uniform = new ProgramUniform(this, i);
        if (numTextureUnits(uniform.uniformType) > 0) {
          uniform.textureUnit = textureUnitCount;
          textureUnitCount++;
        }
        __classPrivateFieldGet$4(this, _Program_uniforms, 'f')[uniform.name] =
          uniform;
      }
      __classPrivateFieldSet$4(this, _Program_uniformsInitialized, true, 'f');
    }
    return __classPrivateFieldGet$4(this, _Program_uniforms, 'f');
  }
  get attributes() {
    if (!__classPrivateFieldGet$4(this, _Program_attributesInitialized, 'f')) {
      const { gl } = this.context;
      const numActiveAttributes = gl.getProgramParameter(
        this.glProgram,
        gl.ACTIVE_ATTRIBUTES
      );
      for (let i = 0; i < numActiveAttributes; ++i) {
        const attribute = new ProgramAttribute(this, i);
        __classPrivateFieldGet$4(this, _Program_attributes, 'f')[
          attribute.name
        ] = attribute;
      }
      __classPrivateFieldSet$4(this, _Program_attributesInitialized, true, 'f');
    }
    return __classPrivateFieldGet$4(this, _Program_attributes, 'f');
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
    const { gl } = this.context;
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
        gl.bindBuffer(
          bufferGeometry.indices.buffer.target,
          bufferGeometry.indices.buffer.glBuffer
        );
      }
    } else if (buffers instanceof VertexArrayObject) {
      const vao = buffers;
      glxVAO.bindVertexArrayOES(vao.glVertexArrayObject);
    } else {
      throw new Error('not implemented');
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
(_Program_validated = new WeakMap()),
  (_Program_uniformsInitialized = new WeakMap()),
  (_Program_uniforms = new WeakMap()),
  (_Program_attributesInitialized = new WeakMap()),
  (_Program_attributes = new WeakMap());
function makeProgramFromShaderMaterial(context, shaderMaterial) {
  return new Program(
    context,
    shaderMaterial.vertexShaderCode,
    shaderMaterial.fragmentShaderCode,
    shaderMaterial.glslVersion
  );
}
class ProgramPool extends Pool {
  constructor(context) {
    super(context, (context, shaderCodeMaterial, program) => {
      if (program !== undefined) {
        program.dispose();
      }
      return makeProgramFromShaderMaterial(context, shaderCodeMaterial);
    });
  }
}

var WindingOrder;
(function (WindingOrder) {
  WindingOrder[(WindingOrder['Clockwise'] = GL.CW)] = 'Clockwise';
  WindingOrder[(WindingOrder['CounterClockwise'] = GL.CCW)] =
    'CounterClockwise';
})(WindingOrder || (WindingOrder = {}));
var CullingSide;
(function (CullingSide) {
  CullingSide[(CullingSide['Front'] = GL.FRONT)] = 'Front';
  CullingSide[(CullingSide['Back'] = GL.BACK)] = 'Back';
  CullingSide[(CullingSide['FrontBack'] = GL.FRONT_AND_BACK)] = 'FrontBack';
})(CullingSide || (CullingSide = {}));
class CullingState {
  constructor(
    enabled = true,
    sides = CullingSide.Back,
    windingOrder = WindingOrder.CounterClockwise
  ) {
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
    return (
      this.enabled === cs.enabled &&
      this.sides === cs.sides &&
      this.windingOrder === cs.windingOrder
    );
  }
}

var DepthTestFunc;
(function (DepthTestFunc) {
  DepthTestFunc[(DepthTestFunc['Never'] = GL.NEVER)] = 'Never';
  DepthTestFunc[(DepthTestFunc['Less'] = GL.LESS)] = 'Less';
  DepthTestFunc[(DepthTestFunc['Equal'] = GL.EQUAL)] = 'Equal';
  DepthTestFunc[(DepthTestFunc['LessOrEqual'] = GL.LEQUAL)] = 'LessOrEqual';
  DepthTestFunc[(DepthTestFunc['Greater'] = GL.GREATER)] = 'Greater';
  DepthTestFunc[(DepthTestFunc['NotEqual'] = GL.NOTEQUAL)] = 'NotEqual';
  DepthTestFunc[(DepthTestFunc['GreaterOrEqual'] = GL.GEQUAL)] =
    'GreaterOrEqual';
  DepthTestFunc[(DepthTestFunc['Always'] = GL.ALWAYS)] = 'Always';
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
    this.OES_element_index_uint = getRequiredExtension(
      gl,
      'OES_element_index_uint'
    );
    this.OES_standard_derivatives = getRequiredExtension(
      gl,
      'OES_standard_derivatives'
    );
    this.OES_vertex_array_object = getRequiredExtension(
      gl,
      'OES_vertex_array_object'
    );
    this.WEBGL_depth_texture = getRequiredExtension(gl, 'WEBGL_depth_texture');
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
    this.EXT_shader_texture_lod = gl.getExtension('EXT_shader_texture_lod');
    this.EXT_texture_filter_anisotropic = gl.getExtension(
      'EXT_texture_filter_anisotropic'
    );
    this.KHR_parallel_shader_compile =
      gl.getExtension('KHR_parallel_shader_compile') !== null
        ? new KHR_parallel_shader_compile()
        : null;
    this.WEBGL_debug_renderer_info = gl.getExtension(
      'WEBGL_debug_renderer_info'
    );
    this.WEBGL_debug_shaders = gl.getExtension('WEBGL_debug_shaders');
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
    const { canvas } = this;
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
    return new Vector2(
      this.context.gl.drawingBufferWidth,
      this.context.gl.drawingBufferHeight
    );
  }
  get aspectRatio() {
    return (
      this.context.gl.drawingBufferWidth / this.context.gl.drawingBufferHeight
    );
  }
  dispose() {}
}

class MaskState {
  constructor(
    red = true,
    green = true,
    blue = true,
    alpha = true,
    depth = true,
    stencil = 0
  ) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
    this.depth = depth;
    this.stencil = stencil;
  }
  clone() {
    return new MaskState(
      this.red,
      this.green,
      this.blue,
      this.alpha,
      this.depth,
      this.stencil
    );
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
    return (
      this.red === ms.red &&
      this.green === ms.green &&
      this.blue === ms.blue &&
      this.alpha === ms.alpha &&
      this.depth === ms.depth &&
      this.stencil === ms.stencil
    );
  }
}

function getParameterAsString(gl, parameterId, result = '') {
  const text = gl.getParameter(parameterId);
  if (typeof text === 'string') {
    result = text;
  }
  return result;
}

var __classPrivateFieldSet$3 =
  (undefined && undefined.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a setter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it'
      );
    return (
      kind === 'a'
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var __classPrivateFieldGet$3 =
  (undefined && undefined.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a getter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      );
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var _RenderingContext_program,
  _RenderingContext_framebuffer,
  _RenderingContext_scissor,
  _RenderingContext_viewport,
  _RenderingContext_depthTestState,
  _RenderingContext_blendState,
  _RenderingContext_clearState,
  _RenderingContext_maskState,
  _RenderingContext_cullingState;
class RenderingContext {
  constructor(canvas, attributes = undefined) {
    this.canvas = canvas;
    this.resources = {};
    this.nextResourceId = 0;
    _RenderingContext_program.set(this, undefined);
    _RenderingContext_framebuffer.set(this, void 0);
    _RenderingContext_scissor.set(this, new Box2());
    _RenderingContext_viewport.set(this, new Box2());
    _RenderingContext_depthTestState.set(this, new DepthTestState());
    _RenderingContext_blendState.set(this, new BlendState());
    _RenderingContext_clearState.set(this, new ClearState());
    _RenderingContext_maskState.set(this, new MaskState());
    _RenderingContext_cullingState.set(this, new CullingState());
    if (attributes === undefined) {
      attributes = {};
      attributes.alpha = true;
      attributes.antialias = true;
      attributes.depth = true;
      attributes.premultipliedAlpha = true;
      attributes.stencil = true;
    }
    {
      const gl = canvas.getContext('webgl', attributes);
      if (gl === null) {
        throw new Error('webgl not supported');
      }
      this.gl = gl;
    }
    this.glx = new Extensions(this.gl);
    this.glxo = new OptionalExtensions(this.gl);
    this.canvasFramebuffer = new CanvasFramebuffer(this);
    __classPrivateFieldSet$3(
      this,
      _RenderingContext_framebuffer,
      this.canvasFramebuffer,
      'f'
    );
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
    return dri !== null
      ? getParameterAsString(this.gl, dri.UNMASKED_VENDOR_WEBGL)
      : '';
  }
  get debugRenderer() {
    const dri = this.glxo.WEBGL_debug_renderer_info;
    return dri !== null
      ? getParameterAsString(this.gl, dri.UNMASKED_RENDERER_WEBGL)
      : '';
  }
  set program(program) {
    if (
      __classPrivateFieldGet$3(this, _RenderingContext_program, 'f') !== program
    ) {
      if (program !== undefined) {
        program.validate();
        this.gl.useProgram(program.glProgram);
      } else {
        this.gl.useProgram(null);
      }
      __classPrivateFieldSet$3(this, _RenderingContext_program, program, 'f');
    }
  }
  get program() {
    return __classPrivateFieldGet$3(this, _RenderingContext_program, 'f');
  }
  set framebuffer(framebuffer) {
    if (
      __classPrivateFieldGet$3(this, _RenderingContext_framebuffer, 'f') !==
      framebuffer
    ) {
      if (framebuffer instanceof CanvasFramebuffer) {
        this.gl.bindFramebuffer(GL.FRAMEBUFFER, null);
      } else if (framebuffer instanceof Framebuffer) {
        this.gl.bindFramebuffer(GL.FRAMEBUFFER, framebuffer.glFramebuffer);
      }
      __classPrivateFieldSet$3(
        this,
        _RenderingContext_framebuffer,
        framebuffer,
        'f'
      );
    }
  }
  get framebuffer() {
    return __classPrivateFieldGet$3(this, _RenderingContext_framebuffer, 'f');
  }
  get scissor() {
    return __classPrivateFieldGet$3(
      this,
      _RenderingContext_scissor,
      'f'
    ).clone();
  }
  set scissor(s) {
    if (
      !__classPrivateFieldGet$3(this, _RenderingContext_scissor, 'f').equals(s)
    ) {
      this.gl.scissor(s.x, s.y, s.width, s.height);
      __classPrivateFieldGet$3(this, _RenderingContext_scissor, 'f').copy(s);
    }
  }
  get viewport() {
    return __classPrivateFieldGet$3(
      this,
      _RenderingContext_viewport,
      'f'
    ).clone();
  }
  set viewport(v) {
    if (
      !__classPrivateFieldGet$3(this, _RenderingContext_viewport, 'f').equals(v)
    ) {
      this.gl.viewport(v.x, v.y, v.width, v.height);
      __classPrivateFieldGet$3(this, _RenderingContext_viewport, 'f').copy(v);
    }
  }
  get blendState() {
    return __classPrivateFieldGet$3(
      this,
      _RenderingContext_blendState,
      'f'
    ).clone();
  }
  set blendState(bs) {
    if (
      !__classPrivateFieldGet$3(this, _RenderingContext_blendState, 'f').equals(
        bs
      )
    ) {
      this.gl.enable(GL.BLEND);
      this.gl.blendEquation(bs.equation);
      this.gl.blendFuncSeparate(
        bs.sourceRGBFactor,
        bs.destRGBFactor,
        bs.sourceAlphaFactor,
        bs.destAlphaFactor
      );
      __classPrivateFieldGet$3(this, _RenderingContext_blendState, 'f').copy(
        bs
      );
    }
  }
  get depthTestState() {
    return __classPrivateFieldGet$3(
      this,
      _RenderingContext_depthTestState,
      'f'
    ).clone();
  }
  set depthTestState(dts) {
    if (
      !__classPrivateFieldGet$3(
        this,
        _RenderingContext_depthTestState,
        'f'
      ).equals(dts)
    ) {
      if (dts.enabled) {
        this.gl.enable(GL.DEPTH_TEST);
      } else {
        this.gl.disable(GL.DEPTH_TEST);
      }
      this.gl.depthFunc(dts.func);
      __classPrivateFieldGet$3(
        this,
        _RenderingContext_depthTestState,
        'f'
      ).copy(dts);
    }
  }
  get clearState() {
    return __classPrivateFieldGet$3(
      this,
      _RenderingContext_clearState,
      'f'
    ).clone();
  }
  set clearState(cs) {
    if (
      !__classPrivateFieldGet$3(this, _RenderingContext_clearState, 'f').equals(
        cs
      )
    ) {
      this.gl.clearColor(cs.color.r, cs.color.g, cs.color.b, cs.alpha);
      this.gl.clearDepth(cs.depth);
      this.gl.clearStencil(cs.stencil);
      __classPrivateFieldGet$3(this, _RenderingContext_clearState, 'f').copy(
        cs
      );
    }
  }
  get maskState() {
    return __classPrivateFieldGet$3(
      this,
      _RenderingContext_maskState,
      'f'
    ).clone();
  }
  set maskState(ms) {
    if (
      !__classPrivateFieldGet$3(this, _RenderingContext_maskState, 'f').equals(
        ms
      )
    ) {
      this.gl.colorMask(ms.red, ms.green, ms.blue, ms.alpha);
      this.gl.depthMask(ms.depth);
      this.gl.stencilMask(ms.stencil);
      __classPrivateFieldGet$3(this, _RenderingContext_maskState, 'f').copy(ms);
    }
  }
  get cullingState() {
    return __classPrivateFieldGet$3(
      this,
      _RenderingContext_cullingState,
      'f'
    ).clone();
  }
  set cullingState(cs) {
    if (
      !__classPrivateFieldGet$3(
        this,
        _RenderingContext_cullingState,
        'f'
      ).equals(cs)
    ) {
      if (cs.enabled) {
        this.gl.enable(GL.CULL_FACE);
      } else {
        this.gl.disable(GL.CULL_FACE);
      }
      this.gl.frontFace(cs.windingOrder);
      this.gl.cullFace(cs.sides);
      __classPrivateFieldGet$3(this, _RenderingContext_cullingState, 'f').copy(
        cs
      );
    }
  }
}
(_RenderingContext_program = new WeakMap()),
  (_RenderingContext_framebuffer = new WeakMap()),
  (_RenderingContext_scissor = new WeakMap()),
  (_RenderingContext_viewport = new WeakMap()),
  (_RenderingContext_depthTestState = new WeakMap()),
  (_RenderingContext_blendState = new WeakMap()),
  (_RenderingContext_clearState = new WeakMap()),
  (_RenderingContext_maskState = new WeakMap()),
  (_RenderingContext_cullingState = new WeakMap());

function passGeometry(min = new Vector2(-1, -1), max = new Vector2(1, 1)) {
  const geometry = new Geometry();
  geometry.indices = makeUint32Attribute([0, 1, 2, 0, 2, 3]);
  geometry.attributes.position = makeFloat32Attribute(
    [min.x, min.y, min.x, max.y, max.x, max.y, max.x, min.y],
    2
  );
  geometry.attributes.uv = makeFloat32Attribute([0, 1, 0, 0, 1, 0, 1, 1], 2);
  geometry.attributes.normal = makeFloat32Attribute(
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    3
  );
  return geometry;
}

class VirtualTexture {
  constructor(
    level = 0,
    magFilter = TextureFilter.Linear,
    minFilter = TextureFilter.Linear,
    pixelFormat = PixelFormat.RGBA,
    dataType = DataType.UnsignedByte,
    generateMipmaps = true,
    anisotropicLevels = 1
  ) {
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
    this.name = '';
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

class CubeMapTexture extends VirtualTexture {
  constructor(
    images,
    level = 0,
    magFilter = TextureFilter.Linear,
    minFilter = TextureFilter.LinearMipmapLinear,
    pixelFormat = PixelFormat.RGBA,
    dataType = DataType.UnsignedByte,
    generateMipmaps = true,
    anisotropicLevels = 1
  ) {
    super(
      level,
      magFilter,
      minFilter,
      pixelFormat,
      dataType,
      generateMipmaps,
      anisotropicLevels
    );
    this.images = images;
    if (this.images.length % 6 !== 0 || this.images.length === 0) {
      throw new Error(
        `images.length (${this.images.length}) must be a positive multiple of 6`
      );
    }
    this.size = new Vector2(images[0].width, images[0].height);
  }
}
const cubeFaceNames = ['right', 'left', 'top', 'bottom', 'back', 'front'];
const cubeFaceTargets = [
  TextureTarget.CubeMapPositiveX,
  TextureTarget.CubeMapNegativeX,
  TextureTarget.CubeMapPositiveY,
  TextureTarget.CubeMapNegativeY,
  TextureTarget.CubeMapPositiveZ,
  TextureTarget.CubeMapNegativeZ
];
const cubeFaceLooks = [
  new Vector3(1, 0, 0),
  new Vector3(-1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, -1, 0),
  new Vector3(0, 0, 1),
  new Vector3(0, 0, -1)
];
const cubeFaceUps = [
  new Vector3(0, -1, 0),
  new Vector3(0, -1, 0),
  new Vector3(0, 0, 1),
  new Vector3(0, 0, -1),
  new Vector3(0, 1, 0),
  new Vector3(0, -1, 0)
];
function makeMatrix4CubeMapTransform(
  position,
  faceIndex,
  result = new Matrix4()
) {
  return makeMatrix4LookAt(
    position,
    position.clone().add(cubeFaceLooks[faceIndex]),
    cubeFaceUps[faceIndex],
    result
  );
}

var _lib_shaders_includes_cubemaps_cubeFaces_glsl = /* glsl */ `
#ifndef _lib_shaders_includes_cubemaps_cubeFaces_glsl
#define _lib_shaders_includes_cubemaps_cubeFaces_glsl


// reference: https://github.com/tmarrinan/cube2equirect
void directionToCubeFaceUV( vec3 dir, out int face, out vec2 uv ) {

  vec3 temp;

  // X dominant
  if (abs(dir.x) >= abs(dir.y) && abs(dir.x) >= abs(dir.z)) {
		if (dir.x < 0.0) {
      temp = vec3( dir.z, dir.y, -dir.x );
      face = 1; // left
		}
		else {
      temp = vec3( -dir.z, dir.y, dir.x );
      face = 0; // right
		}
	}

  // Y dominant
	else if (abs(dir.y) >= abs(dir.z)) {
		if (dir.y < 0.0) {
      temp = vec3( dir.x, dir.z, -dir.y );
      face = 3; // top
		}
		else {
      temp = vec3( dir.x, -dir.z, dir.y );
      face = 2; // bottom
		}
	}

  // Z domnant
	else {
		if (dir.z < 0.0) {
      temp = vec3( dir.x, -dir.y, dir.z );
      face = 5; // back
		}
		else {
      temp = vec3( dir.x, dir.y, dir.z );
      face = 4; // front
		}
	}

  // world to face clip space
  vec2 clipXY = temp.xy / temp.z;

  // clip space to texture space
  uv = clipXY * 0.5 + 0.5;
}

// Ben believes this is good based on the visual results.
vec3 cubeFaceUVToDirection(int face, vec2 uv) {

  // texture space to clip space.
  vec2 clipXY = uv * 2.0 - 1.0;

  vec3 result;
	if(face == 0) {
		result = vec3( 1., clipXY.y, -clipXY.x );
  }
  else if(face == 1) {
		result = vec3( -1., clipXY.y, clipXY.x );
  }
  else if(face == 2) {
		result =vec3( clipXY.x, 1., -clipXY.y );
  }
	else if(face == 3) {
		result =vec3( clipXY.x, -1., clipXY.y );
  }
	else if(face == 4) {
		result = vec3( clipXY.x, clipXY.y, 1. );
  }
	else  {
		result = vec3( -clipXY.x, clipXY.y, -1. );
  }

  return normalize( result );
}



#endif // end of include guard
`;

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

var cubeFaceFragmentSource = /* glsl */ `
precision highp float;

varying vec3 v_position;
varying vec2 v_uv;

uniform sampler2D map;
uniform int faceIndex;

${_lib_shaders_includes_cubemaps_cubeFaces_glsl}
${_lib_shaders_includes_cubemaps_latLong_glsl}

void main() {

  vec3 direction = cubeFaceUVToDirection( faceIndex, v_uv );
  vec2 equirectangularUv = directionToLatLongUV( direction );

  gl_FragColor = texture2D( map, equirectangularUv );

}

`;

var cubeFaceVertexSource = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;

varying vec3 v_position;
varying vec2 v_uv;

void main() {

  v_position = position;
  v_uv = uv;

  gl_Position = vec4( position, 1. );

}

`;

function makeTexImage2DFromTexture(
  context,
  texture,
  internalFormat = PixelFormat.RGBA
) {
  const params = new TexParameters();
  params.anisotropyLevels = texture.anisotropicLevels;
  params.generateMipmaps = texture.generateMipmaps;
  params.magFilter = texture.magFilter;
  params.minFilter = texture.minFilter;
  params.wrapS = texture.wrapS;
  params.wrapT = texture.wrapT;
  return new TexImage2D(
    context,
    [texture.image],
    texture.pixelFormat,
    texture.dataType,
    internalFormat,
    TextureTarget.Texture2D,
    params
  );
}
function makeTexImage2DFromCubeTexture(
  context,
  texture,
  internalFormat = PixelFormat.RGBA
) {
  const params = new TexParameters();
  params.anisotropyLevels = texture.anisotropicLevels;
  params.generateMipmaps = texture.generateMipmaps;
  params.magFilter = texture.magFilter;
  params.minFilter = texture.minFilter;
  params.wrapS = TextureWrap.ClampToEdge;
  params.wrapT = TextureWrap.ClampToEdge;
  return new TexImage2D(
    context,
    texture.images,
    texture.pixelFormat,
    texture.dataType,
    internalFormat,
    TextureTarget.TextureCubeMap,
    params
  );
}
function makeTexImage2DFromEquirectangularTexture(
  context,
  latLongTexture,
  faceSize = new Vector2(512, 512),
  generateMipmaps = true
) {
  latLongTexture.wrapS = TextureWrap.Repeat;
  latLongTexture.wrapT = TextureWrap.ClampToEdge;
  latLongTexture.minFilter = TextureFilter.Linear;
  const cubeTexture = new CubeMapTexture([
    faceSize,
    faceSize,
    faceSize,
    faceSize,
    faceSize,
    faceSize
  ]);
  cubeTexture.generateMipmaps = generateMipmaps;
  const latLongMap = makeTexImage2DFromTexture(context, latLongTexture);
  const cubeFaceGeometry = passGeometry();
  const cubeFaceMaterial = new ShaderMaterial(
    cubeFaceVertexSource,
    cubeFaceFragmentSource
  );
  const cubeFaceProgram = makeProgramFromShaderMaterial(
    context,
    cubeFaceMaterial
  );
  const cubeFaceBufferGeometry = makeBufferGeometryFromGeometry(
    context,
    cubeFaceGeometry
  );
  const cubeMap = makeTexImage2DFromCubeTexture(context, cubeTexture);
  const cubeFaceFramebuffer = new Framebuffer(context);
  const cubeFaceUniforms = {
    map: latLongMap,
    faceIndex: 0
  };
  cubeFaceTargets.forEach((target, index) => {
    cubeFaceFramebuffer.attach(Attachment.Color0, cubeMap, target, 0);
    cubeFaceUniforms.faceIndex = index;
    renderBufferGeometry(
      cubeFaceFramebuffer,
      cubeFaceProgram,
      cubeFaceUniforms,
      cubeFaceBufferGeometry
    );
  });
  if (generateMipmaps) {
    cubeMap.generateMipmaps();
  }
  cubeFaceFramebuffer.flush();
  cubeFaceFramebuffer.finish();
  cubeFaceFramebuffer.dispose();
  cubeFaceProgram.dispose();
  cubeFaceGeometry.dispose();
  latLongMap.dispose();
  return cubeMap;
}

function fetchImageElement(url, size = new Vector2()) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (size.x > 0 || size.y > 0) {
      image.width = size.x;
      image.height = size.y;
    }
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () => {
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
      .then(
        (imageBitmap) => {
          if (imageBitmap === undefined) {
            throw new Error('imageBitmap is undfined!');
          }
          return resolve(imageBitmap);
        },
        (err) => {
          reject(err);
        }
      );
  });
}
function isImageBitmapSupported() {
  return 'createImageBitmap' in window;
}
function fetchImage(url) {
  if (isImageBitmapSupported() && !url.includes('.svg')) {
    return fetchImageBitmap(url);
  }
  return fetchImageElement(url);
}
async function fetchCubeImages(urlPattern) {
  const cubeMapFaces = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
  const fetchPromises = [];
  cubeMapFaces.forEach((face) => {
    fetchPromises.push(fetchImage(urlPattern.replace('*', face)));
  });
  return Promise.all(fetchPromises);
}

class Texture extends VirtualTexture {
  constructor(
    image,
    wrapS = TextureWrap.ClampToEdge,
    wrapT = TextureWrap.ClampToEdge,
    level = 0,
    magFilter = TextureFilter.Linear,
    minFilter = TextureFilter.LinearMipmapLinear,
    pixelFormat = PixelFormat.RGBA,
    dataType = DataType.UnsignedByte,
    generateMipmaps = true,
    anisotropicLevels = 1
  ) {
    super(
      level,
      magFilter,
      minFilter,
      pixelFormat,
      dataType,
      generateMipmaps,
      anisotropicLevels
    );
    this.image = image;
    this.wrapS = wrapS;
    this.wrapT = wrapT;
    this.size = new Vector2(image.width, image.height);
  }
}
function makeTextureFromVideoElement(video) {
  return new Texture(
    video,
    TextureWrap.ClampToEdge,
    TextureWrap.ClampToEdge,
    0,
    TextureFilter.Linear,
    TextureFilter.Linear,
    PixelFormat.RGB,
    DataType.UnsignedByte,
    false,
    0
  );
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

var fragmentSource = /* glsl */ `
precision highp float;

uniform sampler2D layerMap;
uniform float mipmapBias;
uniform int convertToPremultipliedAlpha;

uniform vec2 layerUVScale;

uniform mat3 uvToTexture;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

${_lib_shaders_includes_math_math_glsl}
${_lib_shaders_includes_color_spaces_srgb_glsl}

void main() {
  vec3 outputColor = vec3(0.);
  vec2 texelUv = ( uvToTexture * vec3( v_uv, 1.0 ) ).xy;

  vec4 layerColor = texture2D( layerMap, texelUv, mipmapBias );

  // premultiply alpha in output as the source PNG is not premultiplied
  if( convertToPremultipliedAlpha == 1 ) {
    layerColor.rgb *= layerColor.a;
  }
  gl_FragColor = layerColor;

}

`;

var vertexSource = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 localToWorld;
uniform mat4 worldToView;
uniform mat4 viewToScreen;

varying vec3 v_viewPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;

void main() {

  v_viewNormal = normalize( ( worldToView * localToWorld * vec4( normal, 0. ) ).xyz );
  v_viewPosition = ( worldToView * localToWorld * vec4( position, 1. ) ).xyz;
  v_uv = uv;

  gl_Position = viewToScreen * vec4( v_viewPosition, 1. );

}

`;

var __classPrivateFieldSet$2 =
  (undefined && undefined.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a setter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it'
      );
    return (
      kind === 'a'
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var __classPrivateFieldGet$2 =
  (undefined && undefined.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a getter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      );
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var _LayerCompositor_bufferGeometry,
  _LayerCompositor_program,
  _LayerCompositor_layers,
  _LayerCompositor_layerVersion,
  _LayerCompositor_offlineLayerVersion;
function releaseImage(image) {
  if (isImageBitmapSupported() && image instanceof ImageBitmap) {
    image.close();
  }
}
class LayerImage {
  constructor(url, texImage2D, image) {
    this.url = url;
    this.texImage2D = texImage2D;
    this.image = image;
    this.disposed = false;
    this.renderId = -1;
  }
  dispose() {
    if (!this.disposed) {
      this.texImage2D.dispose();
      releaseImage(this.image);
      this.image = undefined;
      this.disposed = true;
    }
  }
}
function makeColorMipmapAttachment(context, size, dataType = undefined) {
  const texParams = new TexParameters();
  texParams.generateMipmaps = true;
  texParams.anisotropyLevels = 1;
  texParams.wrapS = TextureWrap.ClampToEdge;
  texParams.wrapT = TextureWrap.ClampToEdge;
  texParams.magFilter = TextureFilter.Linear;
  texParams.minFilter = TextureFilter.LinearMipmapLinear;
  return new TexImage2D(
    context,
    [size],
    PixelFormat.RGBA,
    dataType ?? DataType.UnsignedByte,
    PixelFormat.RGBA,
    TextureTarget.Texture2D,
    texParams
  );
}
var ImageFitMode;
(function (ImageFitMode) {
  ImageFitMode[(ImageFitMode['FitWidth'] = 0)] = 'FitWidth';
  ImageFitMode[(ImageFitMode['FitHeight'] = 1)] = 'FitHeight';
})(ImageFitMode || (ImageFitMode = {}));
class LayerCompositor {
  constructor(canvas) {
    this.layerImageCache = {};
    this.texImage2DPromiseCache = {};
    _LayerCompositor_bufferGeometry.set(this, void 0);
    _LayerCompositor_program.set(this, void 0);
    this.imageSize = new Vector2(0, 0);
    this.imageFitMode = ImageFitMode.FitHeight;
    this.zoomScale = 1.0;
    this.panPosition = new Vector2(0.5, 0.5);
    _LayerCompositor_layers.set(this, []);
    _LayerCompositor_layerVersion.set(this, 0);
    _LayerCompositor_offlineLayerVersion.set(this, -1);
    this.firstRender = true;
    this.clearState = new ClearState(new Vector3(1, 1, 1), 0.0);
    this.offscreenSize = new Vector2(0, 0);
    this.renderId = 0;
    this.autoDiscard = false;
    this.context = new RenderingContext(canvas, {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      stencil: false,
      preserveDrawingBuffer: true
    });
    this.context.canvasFramebuffer.devicePixelRatio = window.devicePixelRatio;
    this.context.canvasFramebuffer.resize();
    const plane = planeGeometry(1, 1, 1, 1);
    transformGeometry(
      plane,
      makeMatrix4Translation(new Vector3(0.5, 0.5, 0.0))
    );
    __classPrivateFieldSet$2(
      this,
      _LayerCompositor_bufferGeometry,
      makeBufferGeometryFromGeometry(this.context, plane),
      'f'
    );
    __classPrivateFieldSet$2(
      this,
      _LayerCompositor_program,
      makeProgramFromShaderMaterial(
        this.context,
        new ShaderMaterial(vertexSource, fragmentSource)
      ),
      'f'
    );
  }
  snapshot(mimeFormat = 'image/jpeg', quality = 1.0) {
    const { canvas } = this.context.canvasFramebuffer;
    if (canvas instanceof HTMLCanvasElement) {
      return canvas.toDataURL(mimeFormat, quality);
    }
    throw new Error('snapshot not supported');
  }
  set layers(layers) {
    var _a;
    __classPrivateFieldSet$2(this, _LayerCompositor_layers, layers, 'f');
    __classPrivateFieldSet$2(
      this,
      _LayerCompositor_layerVersion,
      ((_a = __classPrivateFieldGet$2(
        this,
        _LayerCompositor_layerVersion,
        'f'
      )),
      _a++,
      _a),
      'f'
    );
  }
  updateOffscreen() {
    const offscreenSize = new Vector2(
      ceilPow2(this.imageSize.x),
      ceilPow2(this.imageSize.y)
    );
    if (
      this.offscreenFramebuffer === undefined ||
      !this.offscreenSize.equals(offscreenSize)
    ) {
      if (this.offscreenFramebuffer !== undefined) {
        this.offscreenFramebuffer.dispose();
        this.offscreenFramebuffer = undefined;
      }
      this.offscreenColorAttachment = makeColorMipmapAttachment(
        this.context,
        offscreenSize
      );
      this.offscreenFramebuffer = new Framebuffer(this.context);
      this.offscreenFramebuffer.attach(
        Attachment.Color0,
        this.offscreenColorAttachment
      );
      this.offscreenSize.copy(offscreenSize);
    }
  }
  loadTexImage2D(url, image = undefined) {
    const layerImagePromise = this.texImage2DPromiseCache[url];
    if (layerImagePromise !== undefined) {
      console.log(`loading: ${url} (reusing promise)`);
      return layerImagePromise;
    }
    return (this.texImage2DPromiseCache[url] = new Promise((resolve) => {
      const layerImage = this.layerImageCache[url];
      if (layerImage !== undefined) {
        return resolve(layerImage.texImage2D);
      }
      function createTexture(compositor, image) {
        const texture = new Texture(image);
        texture.wrapS = TextureWrap.ClampToEdge;
        texture.wrapT = TextureWrap.ClampToEdge;
        texture.minFilter = TextureFilter.Nearest;
        texture.generateMipmaps = false;
        texture.anisotropicLevels = 1;
        texture.name = url;
        console.log(`loading: ${url}`);
        const texImage2D = makeTexImage2DFromTexture(
          compositor.context,
          texture
        );
        delete compositor.texImage2DPromiseCache[url];
        return (compositor.layerImageCache[url] = new LayerImage(
          url,
          texImage2D,
          image
        )).texImage2D;
      }
      if (image === undefined) {
        fetchImage(url).then((image) => resolve(createTexture(this, image)));
      } else if (
        image instanceof HTMLImageElement ||
        image instanceof ImageBitmap
      ) {
        return resolve(createTexture(this, image));
      }
    })).then((texImage2D) => {
      delete this.texImage2DPromiseCache[url];
      return texImage2D;
    });
  }
  discardTexImage2D(url) {
    const layerImage = this.layerImageCache[url];
    if (layerImage !== undefined) {
      console.log(`discarding: ${url}`);
      layerImage.dispose();
      delete this.layerImageCache[url];
      return true;
    }
    return false;
  }
  render() {
    this.renderId++;
    const { canvasFramebuffer } = this.context;
    const canvasSize = canvasFramebuffer.size;
    const canvasAspectRatio = canvasSize.width / canvasSize.height;
    const imageToCanvasScale =
      this.imageFitMode === ImageFitMode.FitWidth
        ? canvasSize.width / this.imageSize.width
        : canvasSize.height / this.imageSize.height;
    const canvasImageSize = this.imageSize
      .clone()
      .multiplyByScalar(imageToCanvasScale);
    const canvasImageCenter = canvasImageSize.clone().multiplyByScalar(0.5);
    if (this.zoomScale > 1.0) {
      const imagePanPosition = this.panPosition
        .clone()
        .multiplyByScalar(1 / imageToCanvasScale)
        .multiplyByScalar(this.context.canvasFramebuffer.devicePixelRatio);
      const imageCanvasSize = canvasSize
        .clone()
        .multiplyByScalar(1 / imageToCanvasScale);
      const imagePanOffset = imagePanPosition
        .clone()
        .sub(imageCanvasSize.clone().multiplyByScalar(0.5));
      imagePanOffset.x =
        Math.sign(imagePanOffset.x) *
        Math.min(Math.abs(imagePanOffset.x), this.imageSize.x * 0.5);
      imagePanOffset.y =
        Math.sign(imagePanOffset.y) *
        Math.min(Math.abs(imagePanOffset.y), this.imageSize.y * 0.5);
      const canvasPanOffset = imagePanOffset
        .clone()
        .multiplyByScalar(imageToCanvasScale);
      const centeredCanvasPanOffset = canvasPanOffset
        .clone()
        .multiplyByScalar(1 - 1 / this.zoomScale);
      canvasImageCenter.add(centeredCanvasPanOffset);
    }
    const imageToCanvas = makeMatrix4OrthographicSimple(
      canvasSize.height,
      canvasImageCenter,
      -1,
      1,
      this.zoomScale,
      canvasAspectRatio
    );
    const canvasToImage = makeMatrix4Inverse(imageToCanvas);
    const planeToImage = makeMatrix4Scale(
      new Vector3(canvasImageSize.width, canvasImageSize.height, 1.0)
    );
    this.renderLayersToFramebuffer();
    const layerUVScale = new Vector2(
      this.imageSize.width / this.offscreenSize.width,
      this.imageSize.height / this.offscreenSize.height
    );
    const uvScale = makeMatrix3Scale(layerUVScale);
    const uvTranslation = makeMatrix3Translation(
      new Vector2(
        0,
        (this.offscreenSize.height - this.imageSize.height) /
          this.offscreenSize.height
      )
    );
    const uvToTexture = makeMatrix3Concatenation(uvTranslation, uvScale);
    canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 0.0);
    canvasFramebuffer.clear();
    const { offscreenColorAttachment } = this;
    if (offscreenColorAttachment === undefined) {
      return;
    }
    const uniforms = {
      viewToScreen: imageToCanvas,
      screenToView: canvasToImage,
      worldToView: new Matrix4(),
      localToWorld: planeToImage,
      layerMap: offscreenColorAttachment,
      uvToTexture,
      mipmapBias: 0.0,
      convertToPremultipliedAlpha: 0
    };
    const blendState = blendModeToBlendState(Blending.Over, true);
    renderBufferGeometry(
      canvasFramebuffer,
      __classPrivateFieldGet$2(this, _LayerCompositor_program, 'f'),
      uniforms,
      __classPrivateFieldGet$2(this, _LayerCompositor_bufferGeometry, 'f'),
      undefined,
      blendState
    );
    if (this.autoDiscard) {
      for (const url in this.layerImageCache) {
        const layerImage = this.layerImageCache[url];
        if (layerImage !== undefined && layerImage.renderId < this.renderId) {
          this.discardTexImage2D(url);
        }
      }
    }
  }
  renderLayersToFramebuffer() {
    this.updateOffscreen();
    if (
      __classPrivateFieldGet$2(
        this,
        _LayerCompositor_offlineLayerVersion,
        'f'
      ) >= __classPrivateFieldGet$2(this, _LayerCompositor_layerVersion, 'f')
    ) {
      return;
    }
    __classPrivateFieldSet$2(
      this,
      _LayerCompositor_offlineLayerVersion,
      __classPrivateFieldGet$2(this, _LayerCompositor_layerVersion, 'f'),
      'f'
    );
    const { offscreenFramebuffer } = this;
    if (offscreenFramebuffer === undefined) {
      return;
    }
    offscreenFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 0.0);
    offscreenFramebuffer.clear();
    const imageToOffscreen = makeMatrix4Orthographic(
      0,
      this.offscreenSize.width,
      0,
      this.offscreenSize.height,
      -1,
      1
    );
    const offscreenToImage = makeMatrix4Inverse(imageToOffscreen);
    const convertToPremultipliedAlpha = !(isMacOS() || isiOS() || isFirefox())
      ? 0
      : 1;
    __classPrivateFieldGet$2(this, _LayerCompositor_layers, 'f').forEach(
      (layer) => {
        const layerImage = this.layerImageCache[layer.url];
        if (layerImage !== undefined) {
          layerImage.renderId = this.renderId;
        }
        const uniforms = {
          viewToScreen: imageToOffscreen,
          screenToView: offscreenToImage,
          worldToView: new Matrix4(),
          localToWorld: layer.planeToImage,
          layerMap: layer.texImage2D,
          uvToTexture: layer.uvToTexture,
          mipmapBias: 0,
          convertToPremultipliedAlpha
        };
        const blendState = blendModeToBlendState(Blending.Over, true);
        renderBufferGeometry(
          offscreenFramebuffer,
          __classPrivateFieldGet$2(this, _LayerCompositor_program, 'f'),
          uniforms,
          __classPrivateFieldGet$2(this, _LayerCompositor_bufferGeometry, 'f'),
          undefined,
          blendState
        );
      }
    );
    const colorAttachment = this.offscreenColorAttachment;
    if (colorAttachment !== undefined) {
      colorAttachment.generateMipmaps();
    }
  }
}
(_LayerCompositor_bufferGeometry = new WeakMap()),
  (_LayerCompositor_program = new WeakMap()),
  (_LayerCompositor_layers = new WeakMap()),
  (_LayerCompositor_layerVersion = new WeakMap()),
  (_LayerCompositor_offlineLayerVersion = new WeakMap());

async function fetchOBJ(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `response error: ${response.status}:${response.statusText}`
    );
  }
  return parseOBJ(await response.text());
}
const oRegexp = /^o +(.+)/;
const gRegexp = /^g +(.+)/;
const vRegexp = /^v +([\d.+-]+) +([\d.+-]+) +([\d.+-]+)/;
const vnRegexp = /^vn +([\d.+-]+) +([\d.+-]+) +([\d.+-]+)/;
const vtRegexp = /^vt +([\d.+-]+) +([\d.+-]+)/;
const fRegexp =
  /^f( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))?/;
function parseOBJ(text) {
  const geometries = [];
  let workingPositions = [];
  let workingNormals = [];
  let workingUvs = [];
  let positions = [];
  let normals = [];
  let uvs = [];
  let indices = [];
  function commitGroup() {
    if (indices.length === 0) {
      return;
    }
    const geometry = new Geometry();
    geometry.indices = makeUint32Attribute(indices);
    geometry.attributes.position = makeFloat32Attribute(positions, 3);
    geometry.attributes.normal = makeFloat32Attribute(normals, 3);
    geometry.attributes.uv = makeFloat32Attribute(uvs, 2);
    indices = [];
    positions = [];
    normals = [];
    uvs = [];
    geometries.push(geometry);
  }
  function commitObject() {
    commitGroup();
    workingPositions = [];
    workingNormals = [];
    workingUvs = [];
  }
  text.split('\n').forEach((line) => {
    const vMatch = line.match(vRegexp);
    if (vMatch !== null) {
      workingPositions.push(
        parseFloat(vMatch[1]),
        parseFloat(vMatch[2]),
        parseFloat(vMatch[3])
      );
      return;
    }
    const vnMatch = line.match(vnRegexp);
    if (vnMatch !== null) {
      workingNormals.push(
        parseFloat(vnMatch[1]),
        parseFloat(vnMatch[2]),
        parseFloat(vnMatch[3])
      );
      return;
    }
    const vtMatch = line.match(vtRegexp);
    if (vtMatch !== null) {
      workingUvs.push(parseFloat(vtMatch[1]), parseFloat(vtMatch[2]));
      return;
    }
    const fMatch = line.match(fRegexp);
    if (fMatch !== null) {
      const startVertex = positions.length / 3;
      let numVertices = 3;
      if (fMatch[13] !== undefined) {
        numVertices++;
      }
      let baseOffset = 2;
      for (let v = 0; v < numVertices; v++) {
        let pi = (parseInt(fMatch[baseOffset + 0]) - 1) * 3;
        if (pi < 0) {
          pi += workingPositions.length / 3;
        }
        positions.push(
          workingPositions[pi],
          workingPositions[pi + 1],
          workingPositions[pi + 2]
        );
        const uvIndexToken = fMatch[baseOffset + 1];
        if (uvIndexToken.length > 0) {
          let uvi = (parseInt(uvIndexToken) - 1) * 2;
          if (uvi < 0) {
            uvi += workingUvs.length / 2;
          }
          uvs.push(workingUvs[uvi], workingUvs[uvi + 1]);
        }
        const normalIndexToken = fMatch[baseOffset + 2];
        if (normalIndexToken.length > 0) {
          let ni = (parseInt(normalIndexToken) - 1) * 3;
          if (ni < 0) {
            ni += workingNormals.length / 3;
          }
          normals.push(
            workingNormals[ni],
            workingNormals[ni + 1],
            workingNormals[ni + 2]
          );
        }
        baseOffset += 4;
      }
      for (let i = 0; i < numVertices - 2; i++) {
        indices.push(startVertex);
        indices.push(startVertex + i + 1);
        indices.push(startVertex + i + 2);
      }
    } else if (oRegexp.test(line)) {
      commitObject();
    } else if (gRegexp.test(line)) {
      commitGroup();
    }
  });
  commitObject();
  return geometries;
}

function boxGeometry(
  width = 1,
  height = 1,
  depth = 1,
  widthSegments = 1,
  heightSegments = 1,
  depthSegments = 1
) {
  const indices = [];
  const vertices = [];
  const normals = [];
  const uvs = [];
  let numberOfVertices = 0;
  function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY) {
    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;
    const widthHalf = width / 2;
    const heightHalf = height / 2;
    const depthHalf = depth / 2;
    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;
    const vector = new Vector3();
    for (let iy = 0; iy < gridY1; iy++) {
      const y = iy * segmentHeight - heightHalf;
      for (let ix = 0; ix < gridX1; ix++) {
        const x = ix * segmentWidth - widthHalf;
        vector.setComponent(u, x * udir);
        vector.setComponent(v, y * vdir);
        vector.setComponent(w, depthHalf);
        vertices.push(vector.x, vector.y, vector.z);
        vector.setComponent(u, 0);
        vector.setComponent(v, 0);
        vector.setComponent(w, depth > 0 ? 1 : -1);
        normals.push(vector.x, vector.y, vector.z);
        uvs.push(ix / gridX);
        uvs.push(1 - iy / gridY);
      }
    }
    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = numberOfVertices + ix + gridX1 * iy;
        const b = numberOfVertices + ix + gridX1 * (iy + 1);
        const c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
        const d = numberOfVertices + (ix + 1) + gridX1 * iy;
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
    numberOfVertices += 4;
  }
  buildPlane(
    2,
    1,
    0,
    -1,
    -1,
    depth,
    height,
    width,
    depthSegments,
    heightSegments
  );
  buildPlane(
    2,
    1,
    0,
    1,
    -1,
    depth,
    height,
    -width,
    depthSegments,
    heightSegments
  );
  buildPlane(0, 2, 1, 1, 1, width, depth, height, widthSegments, depthSegments);
  buildPlane(
    0,
    2,
    1,
    1,
    -1,
    width,
    depth,
    -height,
    widthSegments,
    depthSegments
  );
  buildPlane(
    0,
    1,
    2,
    1,
    -1,
    width,
    height,
    depth,
    widthSegments,
    heightSegments
  );
  buildPlane(
    0,
    1,
    2,
    -1,
    -1,
    width,
    height,
    -depth,
    widthSegments,
    heightSegments
  );
  const geometry = new Geometry();
  geometry.indices = makeUint32Attribute(indices);
  geometry.attributes.position = makeFloat32Attribute(vertices, 3);
  geometry.attributes.normal = makeFloat32Attribute(normals, 3);
  geometry.attributes.uv = makeFloat32Attribute(uvs, 2);
  return geometry;
}

function cylinderGeometry(
  radius = 0.5,
  height = 1,
  segments = 8,
  thetaStart = 0,
  thetaLength = Math.PI * 2
) {
  const indicesTop = [];
  const verticesTop = [];
  const normalsTop = [];
  const uvsTop = [];
  const indicesBottom = [];
  const verticesBottom = [];
  const normalsBottom = [];
  const uvsBottom = [];
  const indicesSide = [];
  const verticesSide = [];
  const normalsSide = [];
  const uvsSide = [];
  const vertex = new Vector3();
  const uv = new Vector2();
  verticesTop.push(0, 0, height * 0.5);
  normalsTop.push(0, 0, 1);
  uvsTop.push(0.5, 0.5);
  verticesBottom.push(0, 0, -height * 0.5);
  normalsBottom.push(0, 0, -1);
  uvsBottom.push(0.5, 0.5);
  for (let s = 0, i = 3; s <= segments; s++, i += 3) {
    const segment = thetaStart + (s / segments) * thetaLength;
    vertex.x = radius * Math.cos(segment);
    vertex.y = radius * Math.sin(segment);
    verticesTop.push(vertex.x, vertex.y, vertex.z + height * 0.5);
    verticesBottom.push(vertex.x, vertex.y, vertex.z - height * 0.5);
    verticesSide.push(vertex.x, vertex.y, vertex.z + height * 0.5);
    verticesSide.push(vertex.x, vertex.y, vertex.z - height * 0.5);
    normalsTop.push(0, 0, 1);
    normalsBottom.push(0, 0, -1);
    normalsSide.push(Math.cos(segment), Math.sin(segment), 0);
    normalsSide.push(Math.cos(segment), Math.sin(segment), 0);
    uv.x = (verticesTop[i] / radius + 1) / 2;
    uv.y = (verticesTop[i + 1] / radius + 1) / 2;
    uvsTop.push(uv.x, uv.y);
    uvsBottom.push(1 - uv.x, 1 - uv.y);
    uvsSide.push(s / segments, 0);
    uvsSide.push(s / segments, 1);
  }
  const bo = verticesTop.length / 3;
  const so = (verticesTop.length / 3) * 2;
  for (let i = 1; i <= segments; i++) {
    indicesTop.push(i, i + 1, 0);
    indicesBottom.push(bo + i + 1, bo + i, bo + 0);
  }
  for (let i = 0; i < segments; i++) {
    const io = i * 2;
    indicesSide.push(so + io, so + io + 1, so + io + 3);
    indicesSide.push(so + io, so + io + 3, so + io + 2);
  }
  indicesTop.push(indicesTop[indicesTop.length - 1], 1, 0);
  indicesBottom.push(bo + 1, indicesBottom[indicesBottom.length - 1], bo + 0);
  const geometry = new Geometry();
  geometry.indices = makeUint32Attribute(
    indicesTop.concat(indicesBottom).concat(indicesSide)
  );
  geometry.attributes.position = makeFloat32Attribute(
    verticesTop.concat(verticesBottom).concat(verticesSide),
    3
  );
  geometry.attributes.normal = makeFloat32Attribute(
    normalsTop.concat(normalsBottom).concat(normalsSide),
    3
  );
  geometry.attributes.uv = makeFloat32Attribute(
    uvsTop.concat(uvsBottom).concat(uvsSide),
    2
  );
  return geometry;
}

function diskGeometry(
  radius = 0.5,
  segments = 8,
  thetaStart = 0,
  thetaLength = Math.PI * 2
) {
  const indices = [];
  const vertices = [];
  const normals = [];
  const uvs = [];
  const vertex = new Vector3();
  const uv = new Vector2();
  vertices.push(0, 0, 0);
  normals.push(0, 0, 1);
  uvs.push(0.5, 0.5);
  for (let s = 0, i = 3; s <= segments; s++, i += 3) {
    const segment = thetaStart + (s / segments) * thetaLength;
    vertex.x = radius * Math.cos(segment);
    vertex.y = radius * Math.sin(segment);
    vertices.push(vertex.x, vertex.y, vertex.z);
    normals.push(0, 0, 1);
    uv.x = (vertices[i] / radius + 1) / 2;
    uv.y = (vertices[i + 1] / radius + 1) / 2;
    uvs.push(uv.x, uv.y);
  }
  for (let i = 1; i <= segments; i++) {
    indices.push(i, i + 1, 0);
  }
  indices.push(indices[indices.length - 1], 1, 0);
  const geometry = new Geometry();
  geometry.indices = makeUint32Attribute(indices);
  geometry.attributes.position = makeFloat32Attribute(vertices, 3);
  geometry.attributes.normal = makeFloat32Attribute(normals, 3);
  geometry.attributes.uv = makeFloat32Attribute(uvs, 2);
  return geometry;
}

function tetrahedronGeometry(radius = 1, detail = 0) {
  const vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1];
  const indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];
  return polyhedronGeometry(vertices, indices, radius, detail);
}
function octahedronGeometry(radius = 1, detail = 0) {
  const vertices = [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1];
  const indices = [
    0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2
  ];
  return polyhedronGeometry(vertices, indices, radius, detail);
}
function icosahedronGeometry(radius = 1, detail = 0) {
  const t = (1 + Math.sqrt(5)) / 2;
  const vertices = [
    -1,
    t,
    0,
    1,
    t,
    0,
    -1,
    -t,
    0,
    1,
    -t,
    0,
    0,
    -1,
    t,
    0,
    1,
    t,
    0,
    -1,
    -t,
    0,
    1,
    -t,
    t,
    0,
    -1,
    t,
    0,
    1,
    -t,
    0,
    -1,
    -t,
    0,
    1
  ];
  const indices = [
    0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10,
    2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5,
    2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
  ];
  return polyhedronGeometry(vertices, indices, radius, detail);
}
function dodecahedronGeometry(radius = 1, detail = 0) {
  const t = (1 + Math.sqrt(5)) / 2;
  const r = 1 / t;
  const vertices = [
    -1,
    -1,
    -1,
    -1,
    -1,
    1,
    -1,
    1,
    -1,
    -1,
    1,
    1,
    1,
    -1,
    -1,
    1,
    -1,
    1,
    1,
    1,
    -1,
    1,
    1,
    1,
    0,
    -r,
    -t,
    0,
    -r,
    t,
    0,
    r,
    -t,
    0,
    r,
    t,
    -r,
    -t,
    0,
    -r,
    t,
    0,
    r,
    -t,
    0,
    r,
    t,
    0,
    -t,
    0,
    -r,
    t,
    0,
    -r,
    -t,
    0,
    r,
    t,
    0,
    r
  ];
  const indices = [
    3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4, 8, 17,
    8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0, 1, 18, 0, 18,
    16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18, 3, 2, 3, 13, 18, 1, 9,
    18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4, 0, 8, 11, 9, 5, 11, 5, 19, 11,
    19, 7, 19, 5, 14, 19, 14, 4, 19, 4, 17, 1, 12, 14, 1, 14, 5, 1, 5, 9
  ];
  return polyhedronGeometry(vertices, indices, radius, detail);
}
function polyhedronGeometry(vertices, indices, radius = 1, detail = 0) {
  const vertexBuffer = [];
  const uvBuffer = [];
  subdivide(detail);
  applyRadius(radius);
  generateUVs();
  const geometry = new Geometry();
  geometry.attributes.position = makeFloat32Attribute(vertexBuffer, 3);
  geometry.attributes.normal = makeFloat32Attribute(vertexBuffer.slice(), 3);
  geometry.attributes.uv = makeFloat32Attribute(uvBuffer, 2);
  computeVertexNormals(geometry);
  function subdivide(detail) {
    const a = new Vector3();
    const b = new Vector3();
    const c = new Vector3();
    for (let i = 0; i < indices.length; i += 3) {
      getVertexByIndex(indices[i + 0], a);
      getVertexByIndex(indices[i + 1], b);
      getVertexByIndex(indices[i + 2], c);
      subdivideFace(a, b, c, detail);
    }
  }
  function subdivideFace(a, b, c, detail) {
    const cols = 2 ** detail;
    const v = [];
    for (let i = 0; i <= cols; i++) {
      v[i] = [];
      const aj = a.clone().lerp(c, i / cols);
      const bj = b.clone().lerp(c, i / cols);
      const rows = cols - i;
      for (let j = 0; j <= rows; j++) {
        if (j === 0 && i === cols) {
          v[i][j] = aj;
        } else {
          v[i][j] = aj.clone().lerp(bj, j / rows);
        }
      }
    }
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < 2 * (cols - i) - 1; j++) {
        const k = Math.floor(j / 2);
        if (j % 2 === 0) {
          pushVertex(v[i][k + 1]);
          pushVertex(v[i + 1][k]);
          pushVertex(v[i][k]);
        } else {
          pushVertex(v[i][k + 1]);
          pushVertex(v[i + 1][k + 1]);
          pushVertex(v[i + 1][k]);
        }
      }
    }
  }
  function applyRadius(radius) {
    const vertex = new Vector3();
    for (let i = 0; i < vertexBuffer.length; i += 3) {
      vertex.x = vertexBuffer[i + 0];
      vertex.y = vertexBuffer[i + 1];
      vertex.z = vertexBuffer[i + 2];
      vertex.normalize().multiplyByScalar(radius);
      vertexBuffer[i + 0] = vertex.x;
      vertexBuffer[i + 1] = vertex.y;
      vertexBuffer[i + 2] = vertex.z;
    }
  }
  function generateUVs() {
    const vertex = new Vector3();
    for (let i = 0; i < vertexBuffer.length; i += 3) {
      vertex.x = vertexBuffer[i + 0];
      vertex.y = vertexBuffer[i + 1];
      vertex.z = vertexBuffer[i + 2];
      const u = azimuth(vertex) / 2 / Math.PI + 0.5;
      const v = inclination(vertex) / Math.PI + 0.5;
      uvBuffer.push(u, 1 - v);
    }
    correctUVs();
    correctSeam();
  }
  function correctSeam() {
    for (let i = 0; i < uvBuffer.length; i += 6) {
      const x0 = uvBuffer[i + 0];
      const x1 = uvBuffer[i + 2];
      const x2 = uvBuffer[i + 4];
      const max = Math.max(x0, x1, x2);
      const min = Math.min(x0, x1, x2);
      if (max > 0.9 && min < 0.1) {
        if (x0 < 0.2) {
          uvBuffer[i + 0] += 1;
        }
        if (x1 < 0.2) {
          uvBuffer[i + 2] += 1;
        }
        if (x2 < 0.2) {
          uvBuffer[i + 4] += 1;
        }
      }
    }
  }
  function pushVertex(vertex) {
    vertexBuffer.push(vertex.x, vertex.y, vertex.z);
  }
  function getVertexByIndex(index, vertex) {
    const stride = index * 3;
    vertex.x = vertices[stride + 0];
    vertex.y = vertices[stride + 1];
    vertex.z = vertices[stride + 2];
  }
  function correctUVs() {
    const a = new Vector3();
    const b = new Vector3();
    const c = new Vector3();
    const centroid = new Vector3();
    const uvA = new Vector2();
    const uvB = new Vector2();
    const uvC = new Vector2();
    for (let i = 0, j = 0; i < vertexBuffer.length; i += 9, j += 6) {
      a.set(vertexBuffer[i + 0], vertexBuffer[i + 1], vertexBuffer[i + 2]);
      b.set(vertexBuffer[i + 3], vertexBuffer[i + 4], vertexBuffer[i + 5]);
      c.set(vertexBuffer[i + 6], vertexBuffer[i + 7], vertexBuffer[i + 8]);
      uvA.set(uvBuffer[j + 0], uvBuffer[j + 1]);
      uvB.set(uvBuffer[j + 2], uvBuffer[j + 3]);
      uvC.set(uvBuffer[j + 4], uvBuffer[j + 5]);
      centroid
        .copy(a)
        .add(b)
        .add(c)
        .multiplyByScalar(1.0 / 3);
      const azi = azimuth(centroid);
      correctUV(uvA, j + 0, a, azi);
      correctUV(uvB, j + 2, b, azi);
      correctUV(uvC, j + 4, c, azi);
    }
  }
  function correctUV(uv, stride, vector, azimuth) {
    if (azimuth < 0 && uv.x === 1) {
      uvBuffer[stride] = uv.x - 1;
    }
    if (vector.x === 0 && vector.z === 0) {
      uvBuffer[stride] = azimuth / 2 / Math.PI + 0.5;
    }
  }
  function azimuth(vector) {
    return Math.atan2(vector.z, -vector.x);
  }
  function inclination(vector) {
    return Math.atan2(
      -vector.y,
      Math.sqrt(vector.x * vector.x + vector.z * vector.z)
    );
  }
  return geometry;
}

class Material {
  constructor() {
    this.disposed = false;
    this.uuid = generateUUID();
    this.version = 0;
    this.name = '';
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

var OutputChannels;
(function (OutputChannels) {
  OutputChannels[(OutputChannels['Beauty'] = 0)] = 'Beauty';
  OutputChannels[(OutputChannels['Albedo'] = 1)] = 'Albedo';
  OutputChannels[(OutputChannels['Roughness'] = 2)] = 'Roughness';
  OutputChannels[(OutputChannels['Metalness'] = 3)] = 'Metalness';
  OutputChannels[(OutputChannels['Occlusion'] = 4)] = 'Occlusion';
  OutputChannels[(OutputChannels['Emissive'] = 5)] = 'Emissive';
  OutputChannels[(OutputChannels['Normal'] = 6)] = 'Normal';
  OutputChannels[(OutputChannels['Depth'] = 7)] = 'Depth';
  OutputChannels[(OutputChannels['Ambient'] = 8)] = 'Ambient';
  OutputChannels[(OutputChannels['Diffuse'] = 9)] = 'Diffuse';
  OutputChannels[(OutputChannels['Specular'] = 10)] = 'Specular';
  OutputChannels[(OutputChannels['DepthPacked'] = 11)] = 'DepthPacked';
  OutputChannels[(OutputChannels['MetalnessRoughnessOcclusion'] = 12)] =
    'MetalnessRoughnessOcclusion';
})(OutputChannels || (OutputChannels = {}));

var __classPrivateFieldGet$1 =
  (undefined && undefined.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a getter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      );
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var __classPrivateFieldSet$1 =
  (undefined && undefined.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a setter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it'
      );
    return (
      kind === 'a'
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var _TextureAccessor_uvTransform, _TextureAccessor_uvTransformVersion;
class TextureAccessor {
  constructor(
    texture = undefined,
    uvIndex = 0,
    uvScale = new Vector2(1, 1),
    uvRotation = 0,
    uvTranslation = new Vector2()
  ) {
    this.texture = texture;
    this.uvIndex = uvIndex;
    this.uvScale = uvScale;
    this.uvRotation = uvRotation;
    this.uvTranslation = uvTranslation;
    this.version = 0;
    _TextureAccessor_uvTransform.set(this, new Matrix3());
    _TextureAccessor_uvTransformVersion.set(this, -1);
  }
  get uvTransform() {
    if (
      __classPrivateFieldGet$1(this, _TextureAccessor_uvTransformVersion, 'f') <
      this.version
    ) {
      __classPrivateFieldSet$1(
        this,
        _TextureAccessor_uvTransform,
        makeMatrix3Translation(
          this.uvTranslation,
          __classPrivateFieldGet$1(this, _TextureAccessor_uvTransform, 'f')
        ),
        'f'
      );
      __classPrivateFieldSet$1(
        this,
        _TextureAccessor_uvTransform,
        makeMatrix3Concatenation(
          __classPrivateFieldGet$1(this, _TextureAccessor_uvTransform, 'f'),
          makeMatrix3RotationFromAngle(this.uvRotation),
          __classPrivateFieldGet$1(this, _TextureAccessor_uvTransform, 'f')
        ),
        'f'
      );
      __classPrivateFieldSet$1(
        this,
        _TextureAccessor_uvTransform,
        makeMatrix3Concatenation(
          __classPrivateFieldGet$1(this, _TextureAccessor_uvTransform, 'f'),
          makeMatrix3Scale(this.uvScale),
          __classPrivateFieldGet$1(this, _TextureAccessor_uvTransform, 'f')
        ),
        'f'
      );
      __classPrivateFieldSet$1(
        this,
        _TextureAccessor_uvTransformVersion,
        this.version,
        'f'
      );
    }
    return __classPrivateFieldGet$1(this, _TextureAccessor_uvTransform, 'f');
  }
  dirty() {
    this.version++;
  }
}
(_TextureAccessor_uvTransform = new WeakMap()),
  (_TextureAccessor_uvTransformVersion = new WeakMap());

class PhysicalMaterial extends Material {
  constructor() {
    super(...arguments);
    this.version = 0;
    this.albedo = new Vector3(1, 1, 1);
    this.albedoMap = new TextureAccessor();
    this.roughness = 0.5;
    this.roughnessMap = new TextureAccessor();
    this.metalness = 0.0;
    this.metalnessMap = new TextureAccessor();
    this.emissive = new Vector3(1, 1, 1);
    this.emissiveMap = new TextureAccessor();
    this.normalFactor = 1.0;
    this.normalMap = new TextureAccessor();
    this.blendMode = Blending.Over;
    this.outputs = OutputChannels.Beauty;
  }
  dirty() {
    this.version++;
  }
}

function normalizedByteToFloats(sourceArray, result = undefined) {
  const scale = 1.0 / 255.0;
  if (result === undefined) {
    result = new Float32Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i++) {
    result[i] = sourceArray[i] * scale;
  }
  return result;
}
function floatsToNormalizedBytes(sourceArray, result = undefined) {
  const scale = 255.0;
  if (result === undefined) {
    result = new Uint8Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i++) {
    result[i] = sourceArray[i] * scale;
  }
  return result;
}

function makeBox2FromPoints(points, result = new Box2()) {
  result.makeEmpty();
  points.forEach((point) => {
    expandBox2ByPoint(result, point);
  });
  return result;
}
function expandBox2ByPoint(b, point) {
  b.min.min(point);
  b.max.max(point);
  return b;
}
function box2ContainsVector2(b, point) {
  return !(
    point.x < b.min.x ||
    point.x > b.max.x ||
    point.y < b.min.y ||
    point.y > b.max.y
  );
}
function box2ContainsBox2(b, otherBox) {
  return (
    b.min.x <= otherBox.min.x &&
    otherBox.max.x <= b.max.x &&
    b.min.y <= otherBox.min.y &&
    otherBox.max.y <= b.max.y
  );
}
function clampVector2ToBox2(b, point) {
  return new Vector2().copy(point).clamp(b.min, b.max);
}
function distanceBox2ToVector2(b, point) {
  const clampedPoint = new Vector2().copy(point).clamp(b.min, b.max);
  return clampedPoint.sub(point).length();
}

class Box3 {
  constructor(
    min = new Vector3(+Infinity, +Infinity, +Infinity),
    max = new Vector3(+Infinity, +Infinity, +Infinity)
  ) {
    this.min = min;
    this.max = max;
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
    return new Box3().copy(this);
  }
  copy(box) {
    this.min.copy(box.min);
    this.max.copy(box.max);
    return this;
  }
  getCenter(result = new Vector3()) {
    return result.set(
      (this.min.x + this.max.x) * 0.5,
      (this.min.y + this.max.y) * 0.5,
      (this.min.z + this.max.z) * 0.5
    );
  }
  makeEmpty() {
    this.min.x = this.min.y = this.min.z = +Infinity;
    this.max.x = this.max.y = this.max.z = -Infinity;
    return this;
  }
  isEmpty() {
    return (
      this.max.x < this.min.x ||
      this.max.y < this.min.y ||
      this.max.z < this.min.z
    );
  }
  expandByPoint(point) {
    this.min.min(point);
    this.max.max(point);
    return this;
  }
  expandByVector(vector) {
    this.min.sub(vector);
    this.max.add(vector);
    return this;
  }
  expandByScalar(scalar) {
    this.min.addScalar(-scalar);
    this.max.addScalar(scalar);
    return this;
  }
  intersect(box) {
    this.min.max(box.min);
    this.max.min(box.max);
    return this;
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

function makeBox3FromArray(array, result = new Box3()) {
  let minX = +Infinity;
  let minY = +Infinity;
  let minZ = +Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  for (let i = 0, l = array.length; i < l; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    if (x < minX) {
      minX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (z < minZ) {
      minZ = z;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y > maxY) {
      maxY = y;
    }
    if (z > maxZ) {
      maxZ = z;
    }
  }
  result.min.set(minX, minY, minZ);
  result.max.set(maxX, maxY, maxZ);
  return result;
}
function makeBox3FromAttribute(attribute, result) {
  let minX = +Infinity;
  let minY = +Infinity;
  let minZ = +Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  const v = new Vector3();
  const vectorView = new Vector3View(attribute);
  for (let i = 0, l = attribute.count; i < l; i++) {
    vectorView.get(i, v);
    if (v.x < minX) {
      minX = v.x;
    }
    if (v.y < minY) {
      minY = v.y;
    }
    if (v.z < minZ) {
      minZ = v.z;
    }
    if (v.x > maxX) {
      maxX = v.x;
    }
    if (v.y > maxY) {
      maxY = v.y;
    }
    if (v.z > maxZ) {
      maxZ = v.z;
    }
  }
  result.min.set(minX, minY, minZ);
  result.max.set(maxX, maxY, maxZ);
  return result;
}
function makeBox3FromPoints(points, result = new Box3()) {
  result.makeEmpty();
  for (let i = 0, il = points.length; i < il; i++) {
    result.expandByPoint(points[i]);
  }
  return result;
}
function makeBox3FromCenterAndSize(center, size, result = new Box3()) {
  result.min.set(
    center.x - size.x * 0.5,
    center.y - size.y * 0.5,
    center.z - size.z * 0.5
  );
  result.max.set(
    center.x + size.x * 0.5,
    center.y + size.y * 0.5,
    center.z + size.z * 0.5
  );
  return result;
}
function makeBox3FromSphereBounds(s, result = new Box3()) {
  if (s.isEmpty()) {
    return result.makeEmpty();
  }
  result.set(s.center, s.center);
  return result.expandByScalar(s.radius);
}
function box3ContainsPoint(box, point) {
  return !(
    point.x < box.min.x ||
    point.x > box.max.x ||
    point.y < box.min.y ||
    point.y > box.max.y ||
    point.z < box.min.z ||
    point.z > box.max.z
  );
}
function box3ContainsBox(box, queryBox) {
  return (
    box.min.x <= queryBox.min.x &&
    queryBox.max.x <= box.max.x &&
    box.min.y <= queryBox.min.y &&
    queryBox.max.y <= box.max.y &&
    box.min.z <= queryBox.min.z &&
    queryBox.max.z <= box.max.z
  );
}
function box3ClampPoint(box, point, result = new Vector3()) {
  return result.copy(point).clamp(box.min, box.max);
}
function box3DistanceToPoint(box, point) {
  return point.clone().clamp(box.min, box.max).sub(point).length();
}
function box3Box3Intersect(a, b, result) {
  result.copy(a);
  result.min.max(b.min);
  result.max.min(b.max);
  return !result.isEmpty();
}
function box3Box3Union(a, b, result = new Box3()) {
  result.copy(a);
  result.expandByPoint(b.min);
  result.expandByPoint(b.max);
  return result;
}
function transformBox3(b, m, result = new Box3()) {
  result.makeEmpty();
  if (b.isEmpty()) {
    return result;
  }
  const v = new Vector3();
  result.expandByPoint(transformPoint3(v.set(b.min.x, b.min.y, b.min.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.min.x, b.min.y, b.max.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.min.x, b.max.y, b.min.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.min.x, b.max.y, b.max.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.max.x, b.min.y, b.min.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.max.x, b.min.y, b.max.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.max.x, b.max.y, b.min.z), m, v));
  result.expandByPoint(transformPoint3(v.set(b.max.x, b.max.y, b.max.z), m, v));
  return result;
}
function translateBox3(b, offset, result = new Box3()) {
  result.copy(b);
  result.min.add(offset);
  result.max.add(offset);
  return result;
}

function makeEulerFromRotationMatrix4(
  m,
  order = EulerOrder3.Default,
  result = new Euler3()
) {
  const te = m.elements;
  const m11 = te[0];
  const m12 = te[4];
  const m13 = te[8];
  const m21 = te[1];
  const m22 = te[5];
  const m23 = te[9];
  const m31 = te[2];
  const m32 = te[6];
  const m33 = te[10];
  let x = 0;
  let y = 0;
  let z = 0;
  switch (order) {
    case EulerOrder3.XYZ:
      y = Math.asin(clamp(m13, -1, 1));
      if (Math.abs(m13) < 0.9999999) {
        x = Math.atan2(-m23, m33);
        z = Math.atan2(-m12, m11);
      } else {
        x = Math.atan2(m32, m22);
        z = 0;
      }
      break;
    case EulerOrder3.YXZ:
      x = Math.asin(-clamp(m23, -1, 1));
      if (Math.abs(m23) < 0.9999999) {
        y = Math.atan2(m13, m33);
        z = Math.atan2(m21, m22);
      } else {
        y = Math.atan2(-m31, m11);
        z = 0;
      }
      break;
    case EulerOrder3.ZXY:
      x = Math.asin(clamp(m32, -1, 1));
      if (Math.abs(m32) < 0.9999999) {
        y = Math.atan2(-m31, m33);
        z = Math.atan2(-m12, m22);
      } else {
        y = 0;
        z = Math.atan2(m21, m11);
      }
      break;
    case EulerOrder3.ZYX:
      y = Math.asin(-clamp(m31, -1, 1));
      if (Math.abs(m31) < 0.9999999) {
        x = Math.atan2(m32, m33);
        z = Math.atan2(m21, m11);
      } else {
        x = 0;
        z = Math.atan2(-m12, m22);
      }
      break;
    case EulerOrder3.YZX:
      z = Math.asin(clamp(m21, -1, 1));
      if (Math.abs(m21) < 0.9999999) {
        x = Math.atan2(-m23, m22);
        y = Math.atan2(-m31, m11);
      } else {
        x = 0;
        y = Math.atan2(m13, m33);
      }
      break;
    case EulerOrder3.XZY:
      z = Math.asin(-clamp(m12, -1, 1));
      if (Math.abs(m12) < 0.9999999) {
        x = Math.atan2(m32, m22);
        y = Math.atan2(m13, m11);
      } else {
        x = Math.atan2(-m23, m33);
        y = 0;
      }
      break;
  }
  return result.set(x, y, z, order);
}
function makeEulerFromQuaternion(q, order, result = new Euler3()) {
  const m = makeMatrix4RotationFromQuaternion(q);
  return makeEulerFromRotationMatrix4(m, order, result);
}

class Line3 {
  constructor(start = new Vector3(), end = new Vector3()) {
    this.start = start;
    this.end = end;
  }
  getHashCode() {
    return hashFloat2(this.start.getHashCode(), this.end.getHashCode());
  }
  set(start, end) {
    this.start.copy(start);
    this.end.copy(end);
    return this;
  }
  clone() {
    return new Line3().copy(this);
  }
  copy(l) {
    this.start.copy(l.start);
    this.end.copy(l.end);
    return this;
  }
  equals(l) {
    return l.start.equals(this.start) && l.end.equals(this.end);
  }
}

class Plane {
  constructor(normal = new Vector3(), constant = 0) {
    this.normal = normal;
    this.constant = constant;
  }
  getHashCode() {
    return hashFloat4(
      this.normal.x,
      this.normal.y,
      this.normal.z,
      this.constant
    );
  }
  set(normal, constant) {
    this.normal.copy(normal);
    this.constant = constant;
    return this;
  }
  clone() {
    return new Plane().copy(this);
  }
  copy(plane) {
    this.normal.copy(plane.normal);
    this.constant = plane.constant;
    return this;
  }
  normalize() {
    const inverseNormalLength = 1.0 / this.normal.length();
    this.normal.multiplyByScalar(inverseNormalLength);
    this.constant *= inverseNormalLength;
    return this;
  }
  negate() {
    this.constant *= -1;
    this.normal.negate();
    return this;
  }
  equals(p) {
    throw p.normal.equals(this.normal) && p.constant === this.constant;
  }
}

function crossFromCoplanarPoints(a, b, c, result = new Vector3()) {
  result.copy(c).sub(b);
  const v = a.clone().sub(b);
  return result.cross(v);
}
function makeVector3FromDelta(a, b, result = new Vector3()) {
  return result.copy(a).sub(b);
}
function makeVector3FromSpherical(s) {
  return makeVector3FromSphericalCoords(s.radius, s.phi, s.theta);
}
function makeVector3FromSphericalCoords(radius, phi, theta) {
  const sinPhiRadius = Math.sin(phi) * radius;
  return new Vector3(
    sinPhiRadius * Math.sin(theta),
    Math.cos(phi) * radius,
    sinPhiRadius * Math.cos(theta)
  );
}
function pointToBaryCoords(a, b, c, point, result = new Vector3()) {
  const v0 = makeVector3FromDelta(c, b);
  const v1 = makeVector3FromDelta(b, a);
  const v2 = makeVector3FromDelta(point, a);
  const dot00 = v0.dot(v0);
  const dot01 = v0.dot(v1);
  const dot02 = v0.dot(v2);
  const dot11 = v1.dot(v1);
  const dot12 = v1.dot(v2);
  const denom = dot00 * dot11 - dot01 * dot01;
  if (denom === 0) {
    return result.set(-2, -1, -1);
  }
  const invDenom = 1 / denom;
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
  return result.set(1 - u - v, v, u);
}
function makeVector3FromBaryCoordWeights(
  baryCoord,
  a,
  b,
  c,
  result = new Vector3()
) {
  const v = baryCoord;
  return result.set(
    a.x * v.x + b.x * v.y + c.x * v.z,
    a.y * v.x + b.y * v.y + c.y * v.z,
    a.z * v.x + b.z * v.y + c.z * v.z
  );
}
function makeColor3FromHex(hex, result = new Vector3()) {
  hex = Math.floor(hex);
  return result.set(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255
  );
}
function hue2rgb(p, q, t) {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * 6 * (2 / 3 - t);
  }
  return p;
}
function makeColor3FromHSL(h, s, l, result = new Vector3()) {
  h = ((h % 1.0) + 1.0) % 1.0;
  s = Math.min(Math.max(s, 0.0), 1.0);
  l = Math.min(Math.max(l, 0.0), 1.0);
  if (s === 0) {
    return result.set(1, 1, 1);
  }
  const p = l <= 0.5 ? l * (1.0 + s) : l + s - l * s;
  const q = 2.0 * l - p;
  return result.set(
    hue2rgb(q, p, h + 1.0 / 3.0),
    hue2rgb(q, p, h),
    hue2rgb(q, p, h - 1.0 / 3.0)
  );
}
function makeHexFromColor3(c) {
  return ((c.r * 255) << 16) ^ ((c.g * 255) << 8) ^ ((c.b * 255) << 0);
}
function makeHexStringFromColor3(c) {
  return `000000${makeHexFromColor3(c).toString(16)}`.slice(-6);
}
function makeHSLFromColor3(c, target) {
  const { r } = c;
  const { g } = c;
  const { b } = c;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let saturation = 0;
  const lightness = (min + max) / 2.0;
  if (min === max) {
    hue = 0;
    saturation = 0;
  } else {
    const delta = max - min;
    saturation =
      lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);
    switch (max) {
      case r:
        hue = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      case b:
        hue = (r - g) / delta + 4;
        break;
    }
    hue /= 6;
  }
  target.h = hue;
  target.s = saturation;
  target.l = lightness;
  return target;
}

function makePlaneFromCoplanarPoints(a, b, c, result = new Plane()) {
  crossFromCoplanarPoints(a, b, c, result.normal);
  result.normal.normalize();
  return makePlaneFromNormalAndCoplanarPoint(result.normal, a, result);
}
function makePlaneFromTriangle(t, result = new Plane()) {
  return makePlaneFromCoplanarPoints(t.a, t.b, t.c, result);
}
function makePlaneFromNormalAndCoplanarPoint(
  normal,
  point,
  result = new Plane()
) {
  result.normal.copy(normal);
  result.constant = -point.dot(normal);
  return result;
}
function planePointDistance(plane, point) {
  return plane.normal.dot(point) + plane.constant;
}
function planeSphereDistance(plane, sphere) {
  return planePointDistance(plane, sphere.center) - sphere.radius;
}
function projectPointOntoPlane(point, plane, result = new Vector3()) {
  const v = point.clone();
  return result
    .copy(plane.normal)
    .multiplyByScalar(-planePointDistance(plane, v))
    .add(v);
}

class Ray {
  constructor(origin = new Vector3(), direction = new Vector3(0, 0, -1)) {
    this.origin = origin;
    this.direction = direction;
  }
  getHashCode() {
    return hashFloat2(this.origin.getHashCode(), this.direction.getHashCode());
  }
  set(origin, direction) {
    this.origin.copy(origin);
    this.direction.copy(direction);
    return this;
  }
  clone() {
    return new Ray().copy(this);
  }
  copy(r) {
    this.origin.copy(r.origin);
    this.direction.copy(r.direction);
    return this;
  }
  at(t, result) {
    return result.copy(this.direction).multiplyByScalar(t).add(this.origin);
  }
  lookAt(v) {
    this.direction.copy(v).sub(this.origin).normalize();
    return this;
  }
  equals(r) {
    return r.origin.equals(this.origin) && r.direction.equals(this.direction);
  }
}

function rayDistanceToPlane(ray, plane) {
  const denominator = plane.normal.dot(ray.direction);
  if (denominator === 0) {
    if (planePointDistance(plane, ray.origin) === 0) {
      return 0;
    }
    return Number.NaN;
  }
  const t = -(ray.origin.dot(plane.normal) + plane.constant) / denominator;
  return t >= 0 ? t : Number.NaN;
}

class Sphere {
  constructor(center = new Vector3(), radius = -1) {
    this.center = center;
    this.radius = radius;
  }
  set(center, radius) {
    this.center.copy(center);
    this.radius = radius;
    return this;
  }
  clone() {
    return new Sphere().copy(this);
  }
  copy(sphere) {
    this.center.copy(sphere.center);
    this.radius = sphere.radius;
    return this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    this.center.set(0, 0, 0);
    this.radius = -1;
    return this;
  }
  equals(s) {
    return s.center.equals(this.center) && s.radius === this.radius;
  }
}

function makeBoundingSphereFromBox(box, result = new Sphere()) {
  box.getCenter(result.center);
  result.radius = box.min.distanceTo(box.max) * 0.5;
  return result;
}
function makeSphereFromPoints(points, optionalCenter, result = new Sphere()) {
  if (optionalCenter !== undefined) {
    result.center.copy(optionalCenter);
  } else {
    makeBox3FromPoints(points).getCenter(result.center);
  }
  let maxRadiusSq = 0;
  for (let i = 0, il = points.length; i < il; i++) {
    maxRadiusSq = Math.max(
      maxRadiusSq,
      result.center.distanceToSquared(points[i])
    );
  }
  result.radius = Math.sqrt(maxRadiusSq);
  return result;
}
function sphereContainsPoint(sphere, point) {
  return (
    point.distanceToSquared(sphere.center) <= sphere.radius * sphere.radius
  );
}
function sphereDistanceToPoint(sphere, point) {
  return point.distanceTo(sphere.center) - sphere.radius;
}
function clampPointToSphere(sphere, point) {
  const deltaLengthSq = sphere.center.distanceToSquared(point);
  if (deltaLengthSq > sphere.radius * sphere.radius) {
    point.sub(sphere.center).normalize();
    point.multiplyByScalar(sphere.radius).add(sphere.center);
  }
  return point;
}
function transformSphere(s, m, result = new Sphere()) {
  transformPoint3(s.center, m, result.center);
  result.radius = s.radius * getMaxScaleOnAxis(m);
  return result;
}
function translateSphere(s, offset, result = new Sphere()) {
  result.copy(s);
  result.center.add(offset);
  return result;
}
function scaleSphere(s, scale, result = new Sphere()) {
  result.copy(s);
  result.radius *= scale;
  return result;
}

class Spherical {
  constructor(radius = 1.0, phi = 0.0, theta = 0.0) {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;
  }
  getHashCode() {
    return hashFloat3(this.radius, this.phi, this.theta);
  }
  set(radius, phi, theta) {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;
    return this;
  }
  clone() {
    return new Spherical().copy(this);
  }
  copy(s) {
    this.radius = s.radius;
    this.phi = s.phi;
    this.theta = s.theta;
    return this;
  }
  makeSafe() {
    const EPS = 0.000001;
    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
    return this;
  }
  equals(s) {
    return (
      s.radius === this.radius && s.phi === this.phi && s.theta === this.theta
    );
  }
}

function makeSphericalFromVector3(v, result = new Spherical()) {
  result.radius = v.length();
  if (result.radius === 0) {
    result.theta = 0;
    result.phi = 0;
  } else {
    result.theta = Math.atan2(v.x, v.z);
    result.phi = Math.acos(Math.min(Math.max(v.y / result.radius, -1), 1));
  }
  return result;
}

class Triangle3 {
  constructor(a = new Vector3(), b = new Vector3(), c = new Vector3()) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
  getHashCode() {
    return hashFloat3(
      this.a.getHashCode(),
      this.b.getHashCode(),
      this.c.getHashCode()
    );
  }
  set(a, b, c) {
    this.a.copy(a);
    this.b.copy(b);
    this.c.copy(c);
    return this;
  }
  clone() {
    return new Triangle3().copy(this);
  }
  copy(t) {
    return this.set(t.a, t.b, t.c);
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}

function makeTriangleFromPointsAndIndices(
  points,
  i0,
  i1,
  i2,
  triangle = new Triangle3()
) {
  triangle.set(points[i0], points[i1], points[i2]);
  return triangle;
}
function triangleArea(t) {
  return crossFromCoplanarPoints(t.a, t.b, t.c).length() * 0.5;
}
function triangleMidpoint(t, result = new Vector3()) {
  return result
    .copy(t.a)
    .add(t.b)
    .add(t.c)
    .multiplyByScalar(1 / 3);
}
function triangleNormal(t, result = new Vector3()) {
  return crossFromCoplanarPoints(t.a, t.b, t.c, result).normalize();
}
function trianglePointToBaryCoords(t, point, result = new Vector3()) {
  return pointToBaryCoords(point, t.a, t.b, t.c, result);
}

function makeVector2FromBaryCoordWeights(
  baryCoord,
  a,
  b,
  c,
  result = new Vector2()
) {
  const v = baryCoord;
  return result.set(
    a.x * v.x + b.x * v.y + c.x * v.z,
    a.y * v.x + b.y * v.y + c.y * v.z
  );
}
function makeVector2Fit(frame, target, result = new Vector2()) {
  result.copy(target);
  const fitScale = Math.min(
    frame.width / result.width,
    frame.height / result.height
  );
  result.multiplyByScalar(fitScale);
  return result;
}
function makeVector2FillHeight(frame, target, result = new Vector2()) {
  result.copy(target);
  const fitScale = frame.height / result.height;
  result.multiplyByScalar(fitScale);
  return result;
}
function makeVector2Fill(frame, target, result = new Vector2()) {
  result.copy(target);
  const fitScale = Math.max(
    frame.width / result.width,
    frame.height / result.height
  );
  result.multiplyByScalar(fitScale);
  return result;
}

function transformPoint2(v, m, result = new Vector2()) {
  const { x } = v;
  const { y } = v;
  const e = m.elements;
  const w = 1 / (e[2] * x + e[5] * y + e[8]);
  result.x = (e[0] * x + e[3] * y + e[6]) * w;
  result.y = (e[1] * x + e[4] * y + e[7]) * w;
  return result;
}
function transformDirection2(v, m, result = new Vector2()) {
  const { x } = v;
  const { y } = v;
  const e = m.elements;
  result.x = e[0] * x + e[3] * y;
  result.y = e[1] * x + e[4] * y;
  return result.normalize();
}

class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
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
  get a() {
    return this.w;
  }
  set a(a) {
    this.w = a;
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
    return new Vector4().copy(this);
  }
  copy(v) {
    return this.set(v.x, v.y, v.z, v.w);
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    return this;
  }
  multiplyByScalar(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
    return this;
  }
  lerp(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    this.w += (v.w - this.w) * alpha;
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
    if (index === 1) {
      return this.y;
    }
    if (index === 2) {
      return this.z;
    }
    if (index === 3) {
      return this.w;
    }
    throw new Error(`index of our range: ${index}`);
  }
  setComponent(index, value) {
    if (index === 0) {
      this.x = value;
    } else if (index === 1) {
      this.y = value;
    } else if (index === 2) {
      this.z = value;
    } else if (index === 3) {
      this.w = value;
    } else {
      throw new Error(`index of our range: ${index}`);
    }
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }
  length() {
    return Math.sqrt(this.lengthSquared());
  }
  lengthSquared() {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  equals(v) {
    return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
  }
  setFromArray(array, offset) {
    this.x = array[offset + 0];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
    this.w = array[offset + 3];
  }
  toArray(array, offset) {
    array[offset + 0] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
    array[offset + 3] = this.w;
  }
}

function rgbeToLinear(source, result = new Vector4()) {
  const s = 2.0 ** (source.a * 255.0 - 128.0);
  return result.set(source.r * s, source.g * s, source.b * s, 1.0);
}
function linearToRgbd(source, maxRange, result = new Vector4()) {
  const maxRGB = Math.max(source.r, source.g, source.b);
  const realD = Math.max(maxRange / maxRGB, 1.0);
  const normalizedD = clamp(Math.floor(realD) / 255.0, 0.0, 1.0);
  const s = normalizedD * (255.0 / maxRange);
  return result.set(source.r * s, source.g * s, source.b * s, normalizedD);
}
function linearToRgbd16(source, result = new Vector4()) {
  return linearToRgbd(source, 16, result);
}
function rgbeToLinearArray(sourceArray, result = undefined) {
  const sourceColor = new Vector4();
  const destColor = new Vector4();
  if (result === undefined) {
    result = new Float32Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i += 4) {
    sourceColor.setFromArray(sourceArray, i);
    rgbeToLinear(sourceColor, destColor);
    destColor.toArray(result, i);
  }
  return result;
}
function linearToRgbdArray(sourceArray, maxRange, result = undefined) {
  const sourceColor = new Vector4();
  const destColor = new Vector4();
  if (result === undefined) {
    result = new Float32Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i += 4) {
    sourceColor.setFromArray(sourceArray, i);
    linearToRgbd(sourceColor, maxRange, destColor);
    destColor.toArray(result, i);
  }
  return result;
}

function negativeZDirectionToEuler(d, result = new Euler3()) {
  console.warn('This has never been tested.');
  const c1 = d.length();
  const s1 = d.z;
  const c2 = c1 !== 0 ? d.x / c1 : 1.0;
  const s2 = c1 !== 0 ? d.y / c1 : 0.0;
  const m = new Matrix4();
  const te = m.elements;
  te[0] = s1 * c2;
  te[4] = s1 * s2;
  te[8] = -c1;
  te[12] = 0;
  te[1] = s2;
  te[5] = -c2;
  te[9] = 0;
  te[13] = 0;
  te[2] = -d.x;
  te[6] = -d.y;
  te[10] = -d.z;
  te[14] = 0;
  te[3] = 0;
  te[7] = 0;
  te[11] = 0;
  te[15] = 1;
  return makeEulerFromRotationMatrix4(m, EulerOrder3.Default, result);
}
function eulerToNegativeZDirection(e, result = new Vector3()) {
  console.warn('This has never been tested.');
  const m = makeMatrix4RotationFromEuler(e);
  const te = m.elements;
  return result.set(te[2], te[6], te[10]);
}

class NodeCollection {
  constructor(parent) {
    this.parent = parent;
    this.array = [];
  }
  add(node) {
    this.array.push(node);
    node.parent = this.parent;
    return this;
  }
  remove(node) {
    const index = this.array.findIndex((n) => n.uuid === node.uuid);
    if (index >= 0) {
      this.array.splice(index, 1);
      node.parent = undefined;
    }
    return this;
  }
  forEach(callbackFn) {
    this.array.forEach(callbackFn);
  }
  get length() {
    return this.array.length;
  }
}

var __classPrivateFieldGet =
  (undefined && undefined.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a getter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      );
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var __classPrivateFieldSet =
  (undefined && undefined.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a setter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it'
      );
    return (
      kind === 'a'
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var _Node_parentToLocalVersion,
  _Node_parentToLocal,
  _Node_localToParentVersion,
  _Node_localToParent,
  _Node_localToWorldTransform,
  _Node_worldToLocalTransform;
class Node {
  constructor() {
    this.disposed = false;
    this.uuid = generateUUID();
    this.version = 0;
    this.parent = undefined;
    this.name = '';
    this.position = new Vector3();
    this.rotation = new Euler3();
    this.scale = new Vector3(1, 1, 1);
    this.visible = true;
    _Node_parentToLocalVersion.set(this, -1);
    _Node_parentToLocal.set(this, new Matrix4());
    _Node_localToParentVersion.set(this, -1);
    _Node_localToParent.set(this, new Matrix4());
    _Node_localToWorldTransform.set(this, new Matrix4());
    _Node_worldToLocalTransform.set(this, new Matrix4());
    this.children = new NodeCollection(this);
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
  get localToParentTransform() {
    if (
      __classPrivateFieldGet(this, _Node_parentToLocalVersion, 'f') !==
      this.version
    ) {
      __classPrivateFieldSet(
        this,
        _Node_localToParent,
        composeMatrix4(
          this.position,
          makeQuaternionFromEuler(this.rotation),
          this.scale,
          __classPrivateFieldGet(this, _Node_localToParent, 'f')
        ),
        'f'
      );
      __classPrivateFieldSet(
        this,
        _Node_parentToLocalVersion,
        this.version,
        'f'
      );
    }
    return __classPrivateFieldGet(this, _Node_localToParent, 'f');
  }
  get parentToLocalTransform() {
    if (
      __classPrivateFieldGet(this, _Node_localToParentVersion, 'f') !==
      this.version
    ) {
      makeMatrix4Inverse(
        this.localToParentTransform,
        __classPrivateFieldGet(this, _Node_parentToLocal, 'f')
      );
      __classPrivateFieldSet(
        this,
        _Node_localToParentVersion,
        this.version,
        'f'
      );
    }
    return __classPrivateFieldGet(this, _Node_localToParent, 'f');
  }
}
(_Node_parentToLocalVersion = new WeakMap()),
  (_Node_parentToLocal = new WeakMap()),
  (_Node_localToParentVersion = new WeakMap()),
  (_Node_localToParent = new WeakMap()),
  (_Node_localToWorldTransform = new WeakMap()),
  (_Node_worldToLocalTransform = new WeakMap());
function depthFirstVisitor(node, callback) {
  node.children.forEach((child) => {
    depthFirstVisitor(child, callback);
  });
  callback(node);
}

class Light extends Node {
  constructor(type, color = new Vector3(1, 1, 1), intensity = 1) {
    super();
    this.type = type;
    this.color = color;
    this.intensity = intensity;
  }
}

var LightType;
(function (LightType) {
  LightType[(LightType['Directional'] = 0)] = 'Directional';
  LightType[(LightType['Point'] = 1)] = 'Point';
  LightType[(LightType['Spot'] = 2)] = 'Spot';
})(LightType || (LightType = {}));

class DirectionalLight extends Light {
  constructor(color = new Vector3(1, 1, 1), intensity = 1.0) {
    super(LightType.Directional, color, intensity);
  }
  get direction() {
    return eulerToNegativeZDirection(this.rotation);
  }
  set direction(v) {
    this.rotation = negativeZDirectionToEuler(v, this.rotation);
  }
}

class PointLight extends Light {
  constructor(color = new Vector3(1, 1, 1), intensity = 1.0, range = -1) {
    super(LightType.Point, color, intensity);
    this.range = range;
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(value) {
    this.intensity = value / (4 * Math.PI);
  }
}

class SpotLight extends Light {
  constructor(
    color = new Vector3(1, 1, 1),
    intensity = 1.0,
    range = -1,
    innerConeAngle = 0,
    outerConeAngle = Math.PI / 4.0
  ) {
    super(LightType.Spot, color, intensity);
    this.range = range;
    this.innerConeAngle = innerConeAngle;
    this.outerConeAngle = outerConeAngle;
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(value) {
    this.intensity = value / (4 * Math.PI);
  }
  get direction() {
    return eulerToNegativeZDirection(this.rotation);
  }
  set direction(v) {
    this.rotation = negativeZDirectionToEuler(v, this.rotation);
  }
}

class PunctualLightUniforms {
  constructor() {
    this.numLights = 0;
    this.lightTypes = [];
    this.lightPositions = [];
    this.lightColors = [];
    this.lightDirections = [];
    this.lightRanges = [];
    this.lightInnerConeCos = [];
    this.lightOuterConeCos = [];
  }
}
function punctualLightsTranslator(rootNode) {
  const result = new PunctualLightUniforms();
  depthFirstVisitor(rootNode, (node) => {
    if (!(node instanceof Light)) {
      return;
    }
    const light = node;
    result.numLights++;
    result.lightTypes.push(light.type);
    result.lightPositions.push(light.position);
    result.lightColors.push(
      light.color.clone().multiplyByScalar(light.intensity)
    );
    if (node instanceof PointLight) {
      const pointLight = node;
      result.lightDirections.push(new Vector3());
      result.lightRanges.push(pointLight.range);
      result.lightInnerConeCos.push(0);
      result.lightOuterConeCos.push(0);
    } else if (node instanceof SpotLight) {
      const spotLight = node;
      result.lightDirections.push(spotLight.direction);
      result.lightRanges.push(spotLight.range);
      result.lightInnerConeCos.push(Math.cos(spotLight.innerConeAngle));
      result.lightOuterConeCos.push(Math.cos(spotLight.outerConeAngle));
    } else if (node instanceof DirectionalLight) {
      const directionalLight = node;
      result.lightDirections.push(directionalLight.direction);
      result.lightRanges.push(0);
      result.lightInnerConeCos.push(0);
      result.lightOuterConeCos.push(0);
    }
  });
  return result;
}

function readPixelsFromFramebuffer(framebuffer, pixelBuffer = undefined) {
  const { context } = framebuffer;
  context.framebuffer = framebuffer;
  const { gl } = context;
  const status = gl.checkFramebufferStatus(GL.FRAMEBUFFER);
  if (status !== GL.FRAMEBUFFER_COMPLETE) {
    throw new Error(`can not read non-complete Framebuffer: ${status}`);
  }
  const texImage2D = framebuffer.getAttachment(Attachment.Color0);
  if (texImage2D === undefined) {
    throw new Error('no attachment on Color0');
  }
  const pixelByteLength =
    sizeOfDataType(texImage2D.dataType) *
    numPixelFormatComponents(texImage2D.pixelFormat) *
    texImage2D.size.width *
    texImage2D.size.height;
  if (pixelBuffer === undefined) {
    pixelBuffer = new Uint8Array(pixelByteLength);
  }
  if (pixelBuffer.byteLength < pixelByteLength) {
    throw new Error(
      `pixelBuffer too small: ${pixelBuffer.byteLength} < ${pixelByteLength}`
    );
  }
  gl.readPixels(
    0,
    0,
    texImage2D.size.width,
    texImage2D.size.height,
    texImage2D.pixelFormat,
    texImage2D.dataType,
    pixelBuffer
  );
  return pixelBuffer;
}
function makeColorAttachment(context, size, dataType = undefined) {
  const texParams = new TexParameters();
  texParams.generateMipmaps = false;
  texParams.magFilter = TextureFilter.Linear;
  texParams.minFilter = TextureFilter.Linear;
  return new TexImage2D(
    context,
    [size],
    PixelFormat.RGBA,
    dataType ?? DataType.UnsignedByte,
    PixelFormat.RGBA,
    TextureTarget.Texture2D,
    texParams
  );
}
function makeDepthAttachment(context, size) {
  const texParams = new TexParameters();
  texParams.generateMipmaps = false;
  texParams.magFilter = TextureFilter.Nearest;
  texParams.minFilter = TextureFilter.Nearest;
  const dataType = DataType.UnsignedShort;
  return new TexImage2D(
    context,
    [size],
    PixelFormat.DepthComponent,
    dataType,
    PixelFormat.DepthComponent,
    TextureTarget.Texture2D,
    texParams
  );
}

var _Renderbuffer_clearState;
class Renderbuffer {
  constructor(context) {
    this.context = context;
    this.disposed = false;
    _Renderbuffer_clearState.set(this, new ClearState());
    const { gl } = this.context;
    {
      const glRenderbuffer = gl.createRenderbuffer();
      if (glRenderbuffer === null) {
        throw new Error('createRenderbuffer failed');
      }
      this.glRenderbuffer = glRenderbuffer;
    }
    this.id = this.context.registerResource(this);
  }
  dispose() {
    if (!this.disposed) {
      const { gl } = this.context;
      gl.deleteRenderbuffer(this.glRenderbuffer);
      this.context.disposeResource(this);
      this.disposed = true;
    }
  }
}
_Renderbuffer_clearState = new WeakMap();

var TextureSourceType;
(function (TextureSourceType) {
  TextureSourceType[(TextureSourceType['ArrayBufferView'] = 0)] =
    'ArrayBufferView';
  TextureSourceType[(TextureSourceType['ImageDate'] = 1)] = 'ImageDate';
  TextureSourceType[(TextureSourceType['HTMLImageElement'] = 2)] =
    'HTMLImageElement';
  TextureSourceType[(TextureSourceType['HTMLCanvasElement'] = 3)] =
    'HTMLCanvasElement';
  TextureSourceType[(TextureSourceType['HTMLVideoElement'] = 4)] =
    'HTMLVideoElement';
  TextureSourceType[(TextureSourceType['ImageBitmap'] = 5)] = 'ImageBitmap';
})(TextureSourceType || (TextureSourceType = {}));

class Buffer {
  constructor(data, position) {
    this.data = data;
    this.position = position;
  }
}
async function fetchCubeHDRs(urlPattern) {
  const cubeMapFaces = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
  const fetchPromises = [];
  cubeMapFaces.forEach((face) => {
    fetchPromises.push(fetchHDR(urlPattern.replace('*', face)));
  });
  return Promise.all(fetchPromises);
}
async function fetchHDR(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `response error: ${response.status}:${response.statusText}`
    );
  }
  return parseHDR(await response.arrayBuffer());
}
function parseHDR(arrayBuffer) {
  const buffer = new Buffer(new Uint8Array(arrayBuffer), 0);
  const header = readHeader(buffer);
  const pixelData = readRLEPixelData(
    buffer.data.subarray(buffer.position),
    header.width,
    header.height
  );
  return new ArrayBufferImage(
    floatsToNormalizedBytes(
      linearToRgbdArray(
        rgbeToLinearArray(normalizedByteToFloats(pixelData)),
        16
      )
    ),
    header.width,
    header.height,
    DataType.UnsignedByte,
    PixelEncoding.RGBE
  );
}
function stringFromCharCodes(unicode) {
  let result = '';
  for (let i = 0; i < unicode.length; i++) {
    result += String.fromCharCode(unicode[i]);
  }
  return result;
}
function fgets(buffer, lineLimit = 0, consume = true) {
  lineLimit = lineLimit === 0 ? 1024 : lineLimit;
  const chunkSize = 128;
  let p = buffer.position;
  let i = -1;
  let len = 0;
  let s = '';
  let chunk = stringFromCharCodes(
    new Uint16Array(buffer.data.subarray(p, p + chunkSize))
  );
  while (
    (i = chunk.indexOf('\n')) < 0 &&
    len < lineLimit &&
    p < buffer.data.byteLength
  ) {
    s += chunk;
    len += chunk.length;
    p += chunkSize;
    chunk += stringFromCharCodes(
      new Uint16Array(buffer.data.subarray(p, p + chunkSize))
    );
  }
  if (i > -1) {
    if (consume !== false) {
      buffer.position += len + i + 1;
    }
    return s + chunk.slice(0, i);
  }
  return undefined;
}
class Header {
  constructor() {
    this.valid = 0;
    this.string = '';
    this.comments = '';
    this.programType = 'RGBE';
    this.format = '';
    this.gamma = 1.0;
    this.exposure = 1.0;
    this.width = 0;
    this.height = 0;
  }
}
function readHeader(buffer) {
  const RGBE_VALID_PROGRAMTYPE = 1;
  const RGBE_VALID_FORMAT = 2;
  const RGBE_VALID_DIMENSIONS = 4;
  let line;
  let match;
  const magicTokenRegex = /^#\?(\S+)$/;
  const gammaRegex = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/;
  const exposureRegex = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/;
  const formatRegex = /^\s*FORMAT=(\S+)\s*$/;
  const dimensionsRegex = /^\s*-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/;
  const header = new Header();
  if (
    buffer.position >= buffer.data.byteLength ||
    (line = fgets(buffer)) === undefined
  ) {
    throw new Error('hrd: no header found');
  }
  if ((match = line.match(magicTokenRegex)) === null) {
    throw new Error('hrd: bad initial token');
  }
  header.valid |= RGBE_VALID_PROGRAMTYPE;
  header.programType = match[1];
  header.string += `${line}\n`;
  while ((line = fgets(buffer)) !== undefined) {
    header.string += `${line}\n`;
    if (line.charAt(0) === '#') {
      header.comments += `${line}\n`;
      continue;
    }
    if ((match = line.match(gammaRegex)) !== null) {
      header.gamma = parseFloat(match[1]);
    }
    if ((match = line.match(exposureRegex)) !== null) {
      header.exposure = parseFloat(match[1]);
    }
    if ((match = line.match(formatRegex)) !== null) {
      header.valid |= RGBE_VALID_FORMAT;
      header.format = match[1];
    }
    if ((match = line.match(dimensionsRegex)) !== null) {
      header.valid |= RGBE_VALID_DIMENSIONS;
      header.height = parseInt(match[1], 10);
      header.width = parseInt(match[2], 10);
    }
    if (
      (header.valid & RGBE_VALID_FORMAT) !== 0 &&
      (header.valid & RGBE_VALID_DIMENSIONS) !== 0
    ) {
      break;
    }
  }
  if ((header.valid & RGBE_VALID_FORMAT) === 0) {
    throw new Error('hrd: missing format specifier');
  }
  if ((header.valid & RGBE_VALID_DIMENSIONS) === 0) {
    throw new Error('hdr: missing image size specifier');
  }
  return header;
}
function readRLEPixelData(byteArray, width, height) {
  if (
    width < 8 ||
    width > 0x7fff ||
    byteArray[0] !== 2 ||
    byteArray[1] !== 2 ||
    (byteArray[2] & 0x80) !== 0
  ) {
    return byteArray;
  }
  if (width !== ((byteArray[2] << 8) | byteArray[3])) {
    throw new Error('hdr: wrong scanline width');
  }
  const dataRgba = new Uint8Array(4 * width * height);
  let offset = 0;
  let pos = 0;
  const ptrEnd = 4 * width;
  const rgbeStart = new Uint8Array(4);
  const scanlineBuffer = new Uint8Array(ptrEnd);
  while (height > 0 && pos < byteArray.byteLength) {
    if (pos + 4 > byteArray.byteLength) {
      throw new Error('hdr: read error');
    }
    rgbeStart[0] = byteArray[pos++];
    rgbeStart[1] = byteArray[pos++];
    rgbeStart[2] = byteArray[pos++];
    rgbeStart[3] = byteArray[pos++];
    if (
      rgbeStart[0] !== 2 ||
      rgbeStart[1] !== 2 ||
      ((rgbeStart[2] << 8) | rgbeStart[3]) !== width
    ) {
      throw new Error('hdr: bad rgbe scanline format');
    }
    let ptr = 0;
    while (ptr < ptrEnd && pos < byteArray.byteLength) {
      let count = byteArray[pos++];
      const isEncodedRun = count > 128;
      if (isEncodedRun) {
        count -= 128;
      }
      if (count === 0 || ptr + count > ptrEnd) {
        throw new Error('hdr: bad scanline data');
      }
      if (isEncodedRun) {
        const byteValue = byteArray[pos++];
        for (let i = 0; i < count; i++) {
          scanlineBuffer[ptr++] = byteValue;
        }
      } else {
        scanlineBuffer.set(byteArray.subarray(pos, pos + count), ptr);
        ptr += count;
        pos += count;
      }
    }
    for (let i = 0; i < width; i++) {
      let off = 0;
      dataRgba[offset] = scanlineBuffer[i + off];
      off += width;
      dataRgba[offset + 1] = scanlineBuffer[i + off];
      off += width;
      dataRgba[offset + 2] = scanlineBuffer[i + off];
      off += width;
      dataRgba[offset + 3] = scanlineBuffer[i + off];
      offset += 4;
    }
    height--;
  }
  return dataRgba;
}

export {
  ArrayBufferImage,
  Attachment,
  Attribute,
  AttributeData,
  BlendEquation,
  BlendFunc,
  BlendState,
  Blending,
  Box2,
  Box3,
  Buffer$1 as Buffer,
  BufferAccessor,
  BufferBit,
  BufferGeometry,
  BufferPool,
  BufferTarget,
  BufferUsage,
  CanvasFramebuffer,
  ClearState,
  ClipSpace,
  ComponentType,
  CubeMapTexture,
  CullingSide,
  CullingState,
  DataType,
  DepthTestFunc,
  DepthTestState,
  DeviceOrientation,
  Euler3,
  EulerOrder3,
  Extensions,
  Framebuffer,
  GL,
  Geometry,
  ImageFitMode,
  KHR_parallel_shader_compile,
  Layer,
  LayerCompositor,
  LayerImage,
  Line3,
  MaskState,
  Material,
  Matrix3,
  Matrix4,
  OptionalExtensions,
  Orbit,
  OutputChannels,
  PhysicalMaterial,
  PixelEncoding,
  PixelFormat,
  Plane,
  Pool,
  PrimitiveType,
  PrimitiveView,
  Program,
  ProgramAttribute,
  ProgramPool,
  ProgramUniform,
  PunctualLightUniforms,
  Quaternion,
  Ray,
  Renderbuffer,
  RenderingContext,
  ScreenSpace,
  Shader,
  ShaderMaterial,
  ShaderType,
  Sphere,
  Spherical,
  TexImage2D,
  TexParameters,
  Texture,
  TextureAccessor,
  TextureFilter,
  TextureSourceType,
  TextureSpace,
  TextureTarget,
  TextureWrap,
  Triangle3,
  UniformType,
  Vector2,
  Vector2View,
  Vector3,
  Vector3View,
  Vector4,
  VertexArrayObject,
  VirtualFramebuffer,
  VirtualTexture,
  WindingOrder,
  WorldSpace,
  assertTrue,
  blendModeToBlendState,
  box2ContainsBox2,
  box2ContainsVector2,
  box3Box3Intersect,
  box3Box3Union,
  box3ClampPoint,
  box3ContainsBox,
  box3ContainsPoint,
  box3DistanceToPoint,
  boxGeometry,
  ceilPow2,
  clamp,
  clampPointToSphere,
  clampVector2ToBox2,
  componentTypeSizeOf,
  composeMatrix4,
  computeVertexNormals,
  convertToInterleavedGeometry,
  crossFromCoplanarPoints,
  cubeFaceLooks,
  cubeFaceNames,
  cubeFaceTargets,
  cubeFaceUps,
  cylinderGeometry,
  decomposeMatrix4,
  degToRad,
  diskGeometry,
  distanceBox2ToVector2,
  dodecahedronGeometry,
  expandBox2ByPoint,
  fetchCubeHDRs,
  fetchCubeImages,
  fetchHDR,
  fetchImage,
  fetchImageBitmap,
  fetchImageElement,
  fetchOBJ,
  floatsToNormalizedBytes,
  floorPow2,
  generateUUID,
  getMaxScaleOnAxis,
  getParameterAsString,
  hashFloat1,
  hashFloat2,
  hashFloat3,
  hashFloat4,
  hashFloatArray,
  icosahedronGeometry,
  isImageBitmapSupported,
  isPow2,
  linearToRgbd,
  linearToRgbd16,
  linearToRgbdArray,
  linearizeMatrix3FloatArray,
  linearizeMatrix4FloatArray,
  linearizeNumberFloatArray,
  linearizeNumberInt32Array,
  linearizeQuaternionFloatArray,
  linearizeVector2FloatArray,
  linearizeVector3FloatArray,
  makeBoundingSphereFromBox,
  makeBox2FromPoints,
  makeBox3FromArray,
  makeBox3FromAttribute,
  makeBox3FromCenterAndSize,
  makeBox3FromPoints,
  makeBox3FromSphereBounds,
  makeBufferAccessorFromAttribute,
  makeBufferGeometryFromGeometry,
  makeColor3FromHSL,
  makeColor3FromHex,
  makeColorAttachment,
  makeColorMipmapAttachment,
  makeDepthAttachment,
  makeEulerFromQuaternion,
  makeEulerFromRotationMatrix4,
  makeFloat32Attribute,
  makeHSLFromColor3,
  makeHexFromColor3,
  makeHexStringFromColor3,
  makeInt16Attribute,
  makeInt32Attribute,
  makeMatrix3Concatenation,
  makeMatrix3Inverse,
  makeMatrix3RotationFromAngle,
  makeMatrix3Scale,
  makeMatrix3Translation,
  makeMatrix3Transpose,
  makeMatrix3View,
  makeMatrix4Concatenation,
  makeMatrix4CubeMapTransform,
  makeMatrix4Inverse,
  makeMatrix4LookAt,
  makeMatrix4Orthographic,
  makeMatrix4OrthographicSimple,
  makeMatrix4Perspective,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromAngleAxis,
  makeMatrix4RotationFromEuler,
  makeMatrix4RotationFromQuaternion,
  makeMatrix4Scale,
  makeMatrix4Shear,
  makeMatrix4Translation,
  makeMatrix4Transpose,
  makeMatrix4View,
  makePlaneFromCoplanarPoints,
  makePlaneFromNormalAndCoplanarPoint,
  makePlaneFromTriangle,
  makeProgramFromShaderMaterial,
  makeQuaternionFromAxisAngle,
  makeQuaternionFromBaryCoordWeights,
  makeQuaternionFromEuler,
  makeQuaternionFromRotationMatrix4,
  makeQuaternionView,
  makeSphereFromPoints,
  makeSphericalFromVector3,
  makeTexImage2DFromCubeTexture,
  makeTexImage2DFromEquirectangularTexture,
  makeTexImage2DFromTexture,
  makeTextureFromVideoElement,
  makeTriangleFromPointsAndIndices,
  makeUint32Attribute,
  makeUint8Attribute,
  makeVector2Fill,
  makeVector2FillHeight,
  makeVector2Fit,
  makeVector2FromBaryCoordWeights,
  makeVector2View,
  makeVector3FromBaryCoordWeights,
  makeVector3FromDelta,
  makeVector3FromSpherical,
  makeVector3FromSphericalCoords,
  makeVector3View,
  matrix3Determinant,
  matrix4Determinant,
  normalizedByteToFloats,
  numPixelFormatComponents,
  numTextureUnits,
  octahedronGeometry,
  parseHDR,
  parseOBJ,
  passGeometry,
  planeGeometry,
  planePointDistance,
  planeSphereDistance,
  pointToBaryCoords,
  polyhedronGeometry,
  projectPointOntoPlane,
  punctualLightsTranslator,
  radToDeg,
  rayDistanceToPlane,
  readPixelsFromFramebuffer,
  renderBufferGeometry,
  renderPass,
  renderVertexArrayObject,
  rgbeToLinear,
  rgbeToLinearArray,
  scaleSphere,
  sizeOfDataType,
  sphereContainsPoint,
  sphereDistanceToPoint,
  tetrahedronGeometry,
  transformBox3,
  transformDirection2,
  transformGeometry,
  transformNormal3,
  transformPoint2,
  transformPoint3,
  transformSphere,
  translateBox3,
  translateSphere,
  triangleArea,
  triangleMidpoint,
  triangleNormal,
  trianglePointToBaryCoords
};
