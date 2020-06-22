import { Box2 } from "./Box2";
import { Box3 } from "./Box3";
import { Line3 } from "./Line3";
import { Plane } from "./Plane";
import { Ray } from "./Ray";
import { rayDistanceToPlane } from "./Ray.Functions";
import { Sphere } from "./Sphere";
import { Vector3 } from "./Vector3";
import { makeVector3FromDelta } from "./Vector3.Functions";

///// TRIANGLE

export function triangleClosestPointToPoint( triangle: Triangle, point: Vector3, result: Vector3 ): Vector3 {

		if ( target === undefined ) {

			console.warn( 'THREE.Triangle: .closestPointToPoint() target is now required' );
			target = new Vector3();

		}

		var a = this.a, b = this.b, c = this.c;
		var v, w;

		// algorithm thanks to Real-Time Collision Detection by Christer Ericson,
		// published by Morgan Kaufmann Publishers, (c) 2005 Elsevier Inc.,
		// under the accompanying license; see chapter 5.1.5 for detailed explanation.
		// basically, we're distinguishing which of the voronoi regions of the triangle
		// the point lies in with the minimum amount of redundant computation.

		_vab.subVectors( b, a );
		_vac.subVectors( c, a );
		_vap.subVectors( p, a );
		var d1 = _vab.dot( _vap );
		var d2 = _vac.dot( _vap );
		if ( d1 <= 0 && d2 <= 0 ) {

			// vertex region of A; barycentric coords (1, 0, 0)
			return target.copy( a );

		}

		_vbp.subVectors( p, b );
		var d3 = _vab.dot( _vbp );
		var d4 = _vac.dot( _vbp );
		if ( d3 >= 0 && d4 <= d3 ) {

			// vertex region of B; barycentric coords (0, 1, 0)
			return target.copy( b );

		}

		var vc = d1 * d4 - d3 * d2;
		if ( vc <= 0 && d1 >= 0 && d3 <= 0 ) {

			v = d1 / ( d1 - d3 );
			// edge region of AB; barycentric coords (1-v, v, 0)
			return target.copy( a ).addScaledVector( _vab, v );

		}

		_vcp.subVectors( p, c );
		var d5 = _vab.dot( _vcp );
		var d6 = _vac.dot( _vcp );
		if ( d6 >= 0 && d5 <= d6 ) {

			// vertex region of C; barycentric coords (0, 0, 1)
			return target.copy( c );

		}

		var vb = d5 * d2 - d1 * d6;
		if ( vb <= 0 && d2 >= 0 && d6 <= 0 ) {

			w = d2 / ( d2 - d6 );
			// edge region of AC; barycentric coords (1-w, 0, w)
			return target.copy( a ).addScaledVector( _vac, w );

		}

		var va = d3 * d6 - d5 * d4;
		if ( va <= 0 && ( d4 - d3 ) >= 0 && ( d5 - d6 ) >= 0 ) {

			_vbc.subVectors( c, b );
			w = ( d4 - d3 ) / ( ( d4 - d3 ) + ( d5 - d6 ) );
			// edge region of BC; barycentric coords (0, 1-w, w)
			return target.copy( b ).addScaledVector( _vbc, w ); // edge region of BC

		}

		// face region
		var denom = 1 / ( va + vb + vc );
		// u = va * denom
		v = vb * denom;
		w = vc * denom;

		return target.copy( a ).addScaledVector( _vab, v ).addScaledVector( _vac, w );

	},

//// RAY

export function rayIntersectSphere( ray: Ray, sphere: Sphere, result: Vector3 ): boolean {

		let v = makeVector3FromDelta( sphere.center, ray.origin );
		var tca = v.dot( ray.direction );
		var d2 = v.lengthSquared() - tca * tca;
		var radius2 = sphere.radius * sphere.radius;

		if ( d2 > radius2 ) return false;

		var thc = Math.sqrt( radius2 - d2 );

		// t0 = first intersect point - entrance on front of sphere
		var t0 = tca - thc;

		// t1 = second intersect point - exit point on back of sphere
		var t1 = tca + thc;

		// test to see if both t0 and t1 are behind the ray - if so, return null
		if ( t0 < 0 && t1 < 0 ) return false;

		// test to see if t0 is behind the ray:
		// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
		// in order to always return an intersect point that is in front of the ray.

		// else t0 is in front of the ray, so return the first collision point scaled by t0
    ray.at(  t0 >= 0 ? t0 : t1, result );
    return true;
	}

	intersectsSphere: function ( sphere ) {

		return this.distanceSqToPoint( sphere.center ) <= ( sphere.radius * sphere.radius );

	},


export function planeRayIntersect( plane: Plane, ray: Ray, result: Vector3 ): boolean {
		var t = rayDistanceToPlane( ray, plane );
		if ( t === undefined ) {
			return false;
		}
    ray.at( t, result );
    return true;
	}

export function planeIntersectsPlane( a: Plane, b: Plane ): boolean {

		// check if the ray lies on the plane first

		var distToPoint = b.distanceToPoint( a.origin );

		if ( distToPoint === 0 ) {

			return true;

		}

		var denominator = b.normal.dot( a.direction );

		if ( denominator * distToPoint < 0 ) {

			return true;

		}

		// ray origin is behind the plane (and is pointing behind it)

		return false;

	}

export function	rayBox3Intersect( ray: Ray, box:Box3, result: Vector3 ): boolean {

		var tmin, tmax, tymin, tymax, tzmin, tzmax;

		var invdirx = 1 / ray.direction.x,
			invdiry = 1 / ray.direction.y,
			invdirz = 1 / ray.direction.z;

		var origin = ray.origin;

		if ( invdirx >= 0 ) {

			tmin = ( box.min.x - origin.x ) * invdirx;
			tmax = ( box.max.x - origin.x ) * invdirx;

		} else {

			tmin = ( box.max.x - origin.x ) * invdirx;
			tmax = ( box.min.x - origin.x ) * invdirx;

		}

		if ( invdiry >= 0 ) {

			tymin = ( box.min.y - origin.y ) * invdiry;
			tymax = ( box.max.y - origin.y ) * invdiry;

		} else {

			tymin = ( box.max.y - origin.y ) * invdiry;
			tymax = ( box.min.y - origin.y ) * invdiry;

		}

		if ( ( tmin > tymax ) || ( tymin > tmax ) ) return false;

		// These lines also handle the case where tmin or tmax is NaN
		// (result of 0 * Infinity). x !== x returns true if x is NaN

		if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

		if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

		if ( invdirz >= 0 ) {

			tzmin = ( box.min.z - origin.z ) * invdirz;
			tzmax = ( box.max.z - origin.z ) * invdirz;

		} else {

			tzmin = ( box.max.z - origin.z ) * invdirz;
			tzmax = ( box.min.z - origin.z ) * invdirz;

		}

		if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return false;

		if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

		if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

		//return point closest to the ray (positive side)

		if ( tmax < 0 ) return false;

    ray.at( tmin >= 0 ? tmin : tmax, result );

    return true;
	}

	export function boxTriangleIntersect( a, b, c, backfaceCulling, target ) {

		// Compute the offset origin, edges, and normal.

		// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

		_edge1.subVectors( b, a );
		_edge2.subVectors( c, a );
		_normal.crossVectors( _edge1, _edge2 );

		// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
		// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
		//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
		//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
		//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
		var DdN = this.direction.dot( _normal );
		var sign;

		if ( DdN > 0 ) {

			if ( backfaceCulling ) return null;
			sign = 1;

		} else if ( DdN < 0 ) {

			sign = - 1;
			DdN = - DdN;

		} else {

			return null;

		}

		_diff.subVectors( this.origin, a );
		var DdQxE2 = sign * this.direction.dot( _edge2.crossVectors( _diff, _edge2 ) );

		// b1 < 0, no intersection
		if ( DdQxE2 < 0 ) {

			return null;

		}

		var DdE1xQ = sign * this.direction.dot( _edge1.cross( _diff ) );

		// b2 < 0, no intersection
		if ( DdE1xQ < 0 ) {

			return null;

		}

		// b1+b2 > 1, no intersection
		if ( DdQxE2 + DdE1xQ > DdN ) {

			return null;

		}

		// Line intersects triangle, check if ray does.
		var QdN = - sign * _diff.dot( _normal );

		// t < 0, no intersection
		if ( QdN < 0 ) {

			return null;

		}

		// Ray intersects triangle.
		return this.at( QdN / DdN, target );

	},



  export function box2IntersectBox2(a:Box2, b: Box2, result: Box2): Box2 {
    result.copy( a );
    a.max(b.min);
    a.min(b.max);

    return result;
  }


export function planeIntersectLine( plane: Plane, line: Line3, result: Vector3 ): Vector3 {

		if ( target === undefined ) {

			console.warn( 'THREE.Plane: .intersectLine() target is now required' );
			target = new Vector3();

		}

		var direction = line.delta( _vector1 );

		var denominator = this.normal.dot( direction );

		if ( denominator === 0 ) {

			// line is coplanar, return origin
			if ( this.distanceToPoint( line.start ) === 0 ) {

				return target.copy( line.start );

			}

			// Unsure if this is the correct method to handle this case.
			return undefined;

		}

		var t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

		if ( t < 0 || t > 1 ) {

			return undefined;

		}

		return target.copy( direction ).multiplyScalar( t ).add( line.start );

	},

	intersectsLine: function ( line ) {

		// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

		var startSign = this.distanceToPoint( line.start );
		var endSign = this.distanceToPoint( line.end );

		return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

	},

	intersectsBox: function ( box ) {

		return box.intersectsPlane( this );

	},

	intersectsSphere: function ( sphere ) {

		return sphere.intersectsPlane( this );

	},


  export function sphereSphereIntersects(a:Sphere, b: Sphere): boolean {
    var radiusSum = a.radius + b.radius;

    return b.center.distanceToSquared(a.center) <= radiusSum * radiusSum;
  }


  export function spherePlaneIntersects(s:Sphere, plane: Plane): boolean {
    return Math.abs(plane.distanceToPoint(s.center)) <= s.radius;
  }



export function box3Box3Intersects(a: Box3, b: Box3): boolean {
    // using 6 splitting planes to rule out intersections.
    return a.max.x < b.min.x ||
      a.min.x > b.max.x ||
      a.max.y < b.min.y ||
      a.min.y > b.max.y ||
      a.max.z < b.min.z ||
      a.min.z > b.max.z
      ? false
      : true;
  }

export function box3SphereIntersects(b: Box3, sphere: Sphere): boolean {
    // Find the point on the AABB closest to the sphere center.
    b.clampPoint(sphere.center, _vector);

    // If that point is inside the sphere, the AABB and sphere intersect.
    return vec3DistanceSquared( sphere.center) <= sphere.radius * sphere.radius;
  }

  export function box3PlaneIntersects( box: Box3, plane: Plane ): boolena {
    // We compute the minimum and maximum dot product values. If those values
    // are on the same side (back or front) of the plane, then there is no intersection.

    var min, max;

    if (plane.normal.x > 0) {
      min = plane.normal.x * this.min.x;
      max = plane.normal.x * this.max.x;
    } else {
      min = plane.normal.x * this.max.x;
      max = plane.normal.x * this.min.x;
    }

    if (plane.normal.y > 0) {
      min += plane.normal.y * this.min.y;
      max += plane.normal.y * this.max.y;
    } else {
      min += plane.normal.y * this.max.y;
      max += plane.normal.y * this.min.y;
    }

    if (plane.normal.z > 0) {
      min += plane.normal.z * this.min.z;
      max += plane.normal.z * this.max.z;
    } else {
      min += plane.normal.z * this.max.z;
      max += plane.normal.z * this.min.z;
    }

    return min <= -plane.constant && max >= -plane.constant;
  },

function satForAxes(axes, v0, v1, v2, extents) {
  var i, j;

  for (i = 0, j = axes.length - 3; i <= j; i += 3) {
    _testAxis.fromArray(axes, i);
    // project the aabb onto the seperating axis
    var r = extents.x * Math.abs(_testAxis.x) + extents.y * Math.abs(_testAxis.y) + extents.z * Math.abs(_testAxis.z);
    // project all 3 vertices of the triangle onto the seperating axis
    var p0 = v0.dot(_testAxis);
    var p1 = v1.dot(_testAxis);
    var p2 = v2.dot(_testAxis);
    // actual test, basically see if either of the most extreme of the triangle points intersects r
    if (Math.max(-Math.max(p0, p1, p2), Math.min(p0, p1, p2)) > r) {
      // points of the projected triangle are outside the projected half-length of the aabb
      // the axis is seperating and we can exit
      return false;
    }
  }

  return true;
}

  export function box3TriangleIntersects( box: Box3, triangle: Triangle ): boolean {
    if (box.isEmpty()) {
      return false;
    }

    // compute box center and extents
    box.getCenter(_center);
    _extents.subVectors(box.max, _center);

    // translate triangle to aabb origin
    _v0.subVectors(triangle.a, _center);
    _v1.subVectors(triangle.b, _center);
    _v2.subVectors(triangle.c, _center);

    // compute edge vectors for triangle
    _f0.subVectors(_v1, _v0);
    _f1.subVectors(_v2, _v1);
    _f2.subVectors(_v0, _v2);

    // test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
    // make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
    // axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
    var axes = [
      0,
      -_f0.z,
      _f0.y,
      0,
      -_f1.z,
      _f1.y,
      0,
      -_f2.z,
      _f2.y,
      _f0.z,
      0,
      -_f0.x,
      _f1.z,
      0,
      -_f1.x,
      _f2.z,
      0,
      -_f2.x,
      -_f0.y,
      _f0.x,
      0,
      -_f1.y,
      _f1.x,
      0,
      -_f2.y,
      _f2.x,
      0,
    ];
    if (!satForAxes(axes, _v0, _v1, _v2, _extents)) {
      return false;
    }

    // test 3 face normals from the aabb
    axes = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    if (!satForAxes(axes, _v0, _v1, _v2, _extents)) {
      return false;
    }

    // finally testing the face normal of the triangle
    // use already existing triangle edge vectors here
    _triangleNormal.crossVectors(_f0, _f1);
    axes = [_triangleNormal.x, _triangleNormal.y, _triangleNormal.z];

    return satForAxes(axes, _v0, _v1, _v2, _extents);
  },
