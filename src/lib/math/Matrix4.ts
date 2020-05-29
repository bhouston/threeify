//
// based on Matrix4 from Three.js
//
// Authors:
// * @bhouston
//

export class Matrix4 {

    elements: number[] = [

		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1

	];
  
    constructor() {
    }

    set( n11: number, n12: number, n13: number, n14: number,
         n21: number, n22: number, n23: number, n24: number, 
         n31: number, n32: number, n33: number, n34: number, 
         n41: number, n42: number, n43: number, n44: number ) {

        let te = this.elements;

        te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
        te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
        te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
        te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

        return this;

    }

}