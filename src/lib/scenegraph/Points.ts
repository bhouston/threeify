//
// basic node
//
// Authors:
// * @bhouston

import { Geometry } from "../geometry/Geometry";

class Points extends Node {

    geometry: Geometry;
 
    constructor( geometry: Geometry ) {

        super();

        this.geometry = geometry;

    }

}