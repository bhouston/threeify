import { hashFloat2 } from './utils/hash';
import { Vec3 } from './Vec3';

/**
 * Class representing a three-dimensional box.
 * Each box is defined by two points in space, the minimum and maximum points.
 */
export class Box3 {
  /**
   * Create a Box3 object.
   *
   * @param min - The minimum point of the box, default to (+Infinity, +Infinity, +Infinity).
   * @param max - The maximum point of the box, default to (-Infinity, -Infinity, -Infinity).
   */
  constructor(
    public readonly min = new Vec3(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    ),
    public readonly max = new Vec3(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    )
  ) {}

  /** The x-coordinate of the minimum point of the box. */
  get x(): number {
    return this.min.x;
  }

  /** The y-coordinate of the minimum point of the box. */
  get y(): number {
    return this.min.y;
  }

  /** The z-coordinate of the minimum point of the box. */
  get z(): number {
    return this.min.z;
  }

  /** The width of the box, calculated as the difference in x-coordinates of the maximum and minimum points. */
  get width(): number {
    return this.max.x - this.min.x;
  }

  /** The height of the box, calculated as the difference in y-coordinates of the maximum and minimum points. */
  get height(): number {
    return this.max.y - this.min.y;
  }

  /** The depth of the box, calculated as the difference in z-coordinates of the maximum and minimum points. */
  get depth(): number {
    return this.max.z - this.min.z;
  }

  /**
   * Generate a hash code for this box, based on the hash codes of its minimum and maximum points.
   *
   * @returns A number that represents the hash code of this box.
   */
  getHashCode(): number {
    return hashFloat2(this.min.getHashCode(), this.max.getHashCode());
  }

  /**
   * Set the minimum and maximum points of this box to the specified points.
   *
   * @param min - The new minimum point.
   * @param max - The new maximum point.
   * @returns This box for chaining.
   */
  set(min: Vec3, max: Vec3): this {
    min.clone(this.min);
    max.clone(this.max);

    return this;
  }

  /**
   * Create a copy of this box.
   *
   * @param result - The object to receive the result.
   * @returns A copy of this box.
   */
  clone(result = new Box3()): Box3 {
    return result.copy(this);
  }

  /**
   * Copy the properties from another Box3 into this box.
   *
   * @param box - The box to copy from.
   * @returns This box for chaining.
   */
  copy(box: Box3): this {
    box.min.clone(this.min);
    box.max.clone(this.max);

    return this;
  }
}
