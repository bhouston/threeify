#pragma once

#pragma include <math/math>
// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float specularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float specularRoughness ) {

    return saturate( pow( dotNV + ambientOcclusion, exp2( -16.0 * specularRoughness - 1.0 ) ) - 1.0 + ambientOcclusion );

}