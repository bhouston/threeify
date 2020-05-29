//
// basic node
//
// Authors:
// * @bhouston

import { Geometry } from "../core/Geometry.js";

class Mesh extends Node {

    geometry: Geometry;
 
    constructor( geometry: Geometry ) {

        super();

        this.geometry = geometry;

    }

}