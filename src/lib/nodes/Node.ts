//
// basic node
//
// Authors:
// * @bhouston

import { Vector3 } from '../math/Vector3.js';
import { Quaternion } from '../math/Quaternion.js';
import { Matrix4 } from '../math/Matrix4.js';

export class Node {

    name: string = "";
    position: Vector3 = new Vector3( 0, 0, 0 );
    rotation: Quaternion = new Quaternion();
    scale: Vector3 = new Vector3( 0, 0, 0 );
    children: Array<Node> = [];

    constructor() {

    }

	copy( source: Node ) {
        
        this.name = source.name;
        this.position.copy( source.position );
        this.rotation.copy( source.rotation );
        this.scale.copy( source.scale );

        // NOTE: explicitly not copying children!

		return this;

	}

}