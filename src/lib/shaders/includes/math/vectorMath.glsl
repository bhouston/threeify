vec3 project(const in vec3 a, const in vec3 normal) {
    return normal * dot(a, normal);
}

vec3 ortho( const in vec3 a, const in vec3 normal ) {
    return a - project(a, normal);
}
