#pragma once

// Usage: normal *= frontFaceNormalFactor()
float frontFaceNormalFactor() {
    return float( gl_FrontFacing ) * 2.0 - 1.0;
}

mat3 tangentToLocalTransform( vec3 tangent, vec3 bitangent, vec3 normal ) {
    // TODO: ensure things are noramlized before they get here.  This is wasteful.
    return mat3( normalize( tangent ), normalize( bitangent ), normalize( normal ) );
}

//vec3 normalDelta = rgbToNormal( texture2D( normalMap, uv( normalUvIndex ) ).xyz ); // overrides both flatShading and attribute normals


vec3 getApproximateSurfaceNormal( vec3 position ) {
  return normalize(cross(dFdx(v_Position), dFdy(v_Position)));
}
//
// Source:
//   https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/master/src/shaders/pbr.frag
//

struct NormalInfo {
    vec3 ng;   // Geometric normal
    vec3 n;    // Pertubed normal
    vec3 t;    // Pertubed tangent
    vec3 b;    // Pertubed bitangent
};

// Get normal, tangent and bitangent vectors.
NormalInfo getNormalInfo(vec3 v)
{
    vec2 UV = getNormalUV();
    vec3 uv_dx = dFdx(vec3(UV, 0.0));
    vec3 uv_dy = dFdy(vec3(UV, 0.0));

    vec3 t_ = (uv_dy.t * dFdx(v_Position) - uv_dx.t * dFdy(v_Position)) /
        (uv_dx.s * uv_dy.t - uv_dy.s * uv_dx.t);

    vec3 n, t, b, ng;

    // Compute geometrical TBN:
    #ifdef HAS_TANGENTS
        // Trivial TBN computation, present as vertex attribute.
        // Normalize eigenvectors as matrix is linearly interpolated.
        t = normalize(v_TBN[0]);
        b = normalize(v_TBN[1]);
        ng = normalize(v_TBN[2]);
    #else
        // Normals are either present as vertex attributes or approximated.
        #ifdef HAS_NORMALS
            ng = normalize(v_Normal);
        #else
            ng = normalize(cross(dFdx(v_Position), dFdy(v_Position)));
        #endif

        t = normalize(t_ - ng * dot(ng, t_));
        b = cross(ng, t);
    #endif

    // For a back-facing surface, the tangential basis vectors are negated.
    float facing = step(0.0, dot(v, ng)) * 2.0 - 1.0;
    t *= facing;
    b *= facing;
    ng *= facing;

    // Due to anisoptry, the tangent can be further rotated around the geometric normal.
    vec3 direction;
    #ifdef MATERIAL_ANISOTROPY
        #ifdef HAS_ANISOTROPY_DIRECTION_MAP
            direction = texture(u_AnisotropyDirectionSampler, getAnisotropyDirectionUV()).xyz * 2.0 - vec3(1.0);
        #else
            direction = u_AnisotropyDirection;
        #endif
    #else
        direction = vec3(1.0, 0.0, 0.0);
    #endif
    t = mat3(t, b, ng) * normalize(direction);
    b = normalize(cross(ng, t));

    // Compute pertubed normals:
    #ifdef HAS_NORMAL_MAP
        n = texture(u_NormalSampler, UV).rgb * 2.0 - vec3(1.0);
        n *= vec3(u_NormalScale, u_NormalScale, 1.0);
        n = mat3(t, b, ng) * normalize(n);
    #else
        n = ng;
    #endif

    NormalInfo info;
    info.ng = ng;
    info.t = t;
    info.b = b;
    info.n = n;
    return info;
}
