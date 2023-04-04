#pragma once

#pragma import "../math/mat4.glsl"

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Hit {
    float distance;
    vec3 position;
    vec3 normal;
};


Ray mat4TransformRay( const mat4 m, const Ray r ) {
    return Ray( mat4TransformPosition( m, r.origin ), mat4TransformDirection( m, r.direction ) );
}

Hit mat4TransformHit( const mat4 m, const Hit h ) {
    return Hit( h.distance * determinant( m ), mat4TransformPosition( m, h.position ), mat4TransformDirection( m, h.normal ) );
}