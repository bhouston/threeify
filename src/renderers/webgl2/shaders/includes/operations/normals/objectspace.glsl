#pragma once

vec3 objectSpaceNormalDelta( vec3 normalDelta, mat3 normalMatrix ) {
    return  normalize( normalMatrix * normalDelta );;
}