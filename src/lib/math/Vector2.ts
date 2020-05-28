//
// based on Vector2 from Three.js
//
// Authors:
// * @bhouston
//

export class Vector2 {

    x: number;
    y: number;
    
    constructor( x: number = 0, y: number = 0 ) {

        this.x = x;
        this.y = y;

    }

	add( v: Vector2 ) {

		this.x += v.x;
		this.y += v.y;

		return this;

    }

	dot( v: Vector2 ) {

		return this.x * v.x + this.y * v.y;

    }

    length() {

        return Math.sqrt( this.x * this.x + this.y * this.y );

    }

}