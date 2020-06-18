//
// based on Spherical from Three.js
//
// Authors:
// * @bhouston
//

import { Vector3 } from "./Vector3";

export class Spherical {
  constructor(public radius = 1.0, public phi = 0.0, public theta = 0.0) {}

  set(radius: number, phi: number, theta: number): this {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;

    return this;
  }

  clone(): Spherical {
    return new Spherical().copy(this);
  }

  copy(other: Spherical): this {
    this.radius = other.radius;
    this.phi = other.phi;
    this.theta = other.theta;

    return this;
  }

  // restrict phi to be between EPS and PI-EPS
  makeSafe(): this {
    const EPS = 0.000001;
    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));

    return this;
  }

  setFromVector3(v: Vector3): this {
    this.radius = v.length();

    if (this.radius === 0) {
      this.theta = 0;
      this.phi = 0;
    } else {
      this.theta = Math.atan2(v.x, v.z);
      this.phi = Math.acos(Math.min(Math.max(v.y / this.radius, -1), 1));
    }

    return this;
  }
}
