//
// based on Quaternion from Three
//
// Authors:
// * @bhouston
//

export class Quaternion {


    x: number;
    y: number;
    z: number;
    w: number;
    
    constructor( x: number = 0, y: number = 0, z: number = 0, w : number = 1 ) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

    }

	add( q: Quaternion ) {

		this.x += q.x;
		this.y += q.y;
		this.z += q.z;
        this.w += q.w;

		return this;

    }

	dot( q: Quaternion ) {

		return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;

    }

    conjugate() {

        this.x *= - 1;
        this.y *= - 1;
        this.z *= - 1;

        return this;

    }

    length() {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

    }

}