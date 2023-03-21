#pragma once

vec3 calculateReflectedRay(vec3 incidentRay, vec3 surfaceNormal) {
    // https://registry.khronos.org/OpenGL-Refpages/gl4/html/reflect.xhtml
    return reflect( incidentRay, surfaceNormal );
    //return incidentRay - 2.0 * dot(incidentRay, surfaceNormal) * surfaceNormal;
}

vec3 calculateRefractedRay(vec3 incidentRay, vec3 volumeSurfaceNormal, float outsideIOR, float volumeIOR) {
    // https://registry.khronos.org/OpenGL-Refpages/gl4/html/refract.xhtml    
    float IdotN = dot(incidentRay, volumeSurfaceNormal);
    float eta;
    if (IdotN < 0.0) {
        // ray is coming from outside the volume
        eta = outsideIOR / volumeIOR;
    } else {
        // ray is coming from inside the volume
        eta = volumeIOR / outsideIOR;
        IdotN *= -1.0;
    }
    float k = 1.0 - eta * eta * (1.0 - IdotN * IdotN);
    // early exit when total internal reflection occurs
    if (k < 0.0) return vec3(0.0);

    return eta * incidentRay - (eta * IdotN + sqrt(k)) * volumeSurfaceNormal;
}

float fresnelReflectionCoefficient(vec3 incidentRay, vec3 volumeSurfaceNormal, float volumeIOR, float outsideIOR) {
    float IdotN = dot(incidentRay, volumeSurfaceNormal);
    float eta;
    if (IdotN < 0.0) {
        // ray is coming from outside the volume
        eta = outsideIOR / volumeIOR;
    } else {
        // ray is coming from inside the volume
        eta = volumeIOR / outsideIOR;
        IdotN *= -1.0;
    }

    float sin2Refraction = eta * eta * (1.0 - IdotN * IdotN);

    // early exit when total internal reflection occurs
    if (sin2Refraction >= 1.0) return 1.0;

    float cosRefraction = sqrt(1.0 - sin2Refraction);

    float rs = (volumeIOR * IdotN - outsideIOR * cosRefraction) / (volumeIOR * IdotN + outsideIOR * cosRefraction);
    float rp = (outsideIOR * IdotN - volumeIOR * cosRefraction) / (outsideIOR * IdotN + volumeIOR * cosRefraction);

    return clamp( 0.5 * (rs * rs + rp * rp), 0.0, 1.0 );
}

float fresnelTransmissionCoefficient(float reflectionCoefficient) {
    return clamp( 1.0 - reflectionCoefficient, 0.0, 1.0 );
}

