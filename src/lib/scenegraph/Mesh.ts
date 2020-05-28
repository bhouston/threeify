//
// basic node
//
// Authors:
// * @bhouston

import { IndexedGeometry } from "../geometry/IndexedGeometry";

class Mesh extends Node {

    indexedGeometry: IndexedGeometry;
 
    constructor( indexedGeometry : IndexedGeometry ) {

        super();

        this.indexedGeometry = indexedGeometry;

    }

}