//
// based on Spherical from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat3 } from '../core/hash.js';
import { ICloneable, IEquatable, IHashable } from '../core/types.js';

export class Spherical
  implements ICloneable<Spherical>, IEquatable<Spherical>, IHashable
{
  constructor(public radius = 1, public phi = 0, public theta = 0) {}

  getHashCode(): number {
    return hashFloat3(this.radius, this.phi, this.theta);
  }

  set(radius: number, phi: number, theta: number): this {
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;

    return this;
  }

  clone(): Spherical {
    return new Spherical().copy(this);
  }

  copy(s: Spherical): this {
    this.radius = s.radius;
    this.phi = s.phi;
    this.theta = s.theta;

    return this;
  }

  // restrict phi to be between EPS and PI-EPS
  makeSafe(): this {
    const EPS = 0.000001;
    this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));

    return this;
  }

  equals(s: Spherical): boolean {
    return (
      s.radius === this.radius && s.phi === this.phi && s.theta === this.theta
    );
  }
}
