//
// point light inspired by PointLight from three.js
//
// Authors:
// * @bhouston

import { Light } from './Light.js';
import { Color } from '../../math/Color.js';

export class PointLight extends Light {

    distance: number;
    decay: number;

    constructor( color: Color, intensity: number, distance: number = -1, decay: number = 2.0 ) {

        super( color, intensity );

        this.distance = distance;
        this.decay = decay;

    }
    
	get power(): number {

        // intensity = power per solid angle.
        // ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
        return this.intensity * 4 * Math.PI;

    }

	set power(value: number) {

        // intensity = power per solid angle.
        // ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
        this.intensity = value / ( 4 * Math.PI );

    }

	copy( source: PointLight ) {

		super.copy( source );

		this.distance = source.distance;
		this.decay = source.decay;

		return this;

	}

}