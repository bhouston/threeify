//
// basic light node initially based on Light from Three.js
//
// Authors:
// * @bhouston
//

import { Color } from '../../math/Color.js';
import { Node } from '../Node.js';

export class Light extends Node {

	color: Color;
	intensity: number;

	constructor( color: Color = new Color( 1, 1, 1 ), intensity: number = 1 ) {

		super();

		this.color = color;
		this.intensity = intensity;

	}

	copy( source: Light ) {

		super.copy( source );

		this.color.copy( source.color );
		this.intensity = source.intensity;

		return this;

	}

}
