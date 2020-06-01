//
// basic node
//
// Authors:
// * @bhouston
//

import { Vector3 } from '../math/Vector3.js';
import { Quaternion } from '../math/Quaternion.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Euler } from '../math/Euler.js';
import { IVersioned } from '../interfaces/IVersioned.js';
import { IDisposable } from '../interfaces/IDisposable.js';

export class Node implements IVersioned, IDisposable {

    version: number = 0;
    name: string = "";
    position: Vector3 = new Vector3( 0, 0, 0 );
    rotation: Euler = new Euler();
    scale: Vector3 = new Vector3( 0, 0, 0 );
    children: Array<Node> = [];
    
    constructor() {
    }

    dirty() {
        this.version ++;
    }

    dispose() {        
    }

	copy( source: Node ) {
        
        this.name = source.name;
        this.position.copy( source.position );
        this.rotation.copy( source.rotation );
        this.scale.copy( source.scale );

        // NOTE: explicitly not copying children!

		return this;

    }
    
    toLocalToWorldMatrix() {
 
        return new Matrix4().compose( this.position, new Quaternion().setFromEuler( this.rotation ), this.scale );

    }

}

function depthFirstVisitor( node: Node, callback: ( node: Node )=> void ) {

    node.children.forEach( child => {
        
        depthFirstVisitor( child, callback );

    });

    callback( node );

}