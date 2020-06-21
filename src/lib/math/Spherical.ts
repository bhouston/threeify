//
// based on Spherical from Three.js
//
// Authors:
// * @bhouston
//

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
}
