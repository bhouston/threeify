

vec3 worldViewDirection = normalize( worldCameraPosition - worldPosition );
// or
vec3 worldViewDirection = inverseTransformDirection( viewViewDirection, worldToView );
vec3 worldNormal = inverseTransformDirection( viewNormal, worldToView );

vec4 transmission = BTDF_TransmissionAttenuation(
    worldNormal, worldViewDirection, worldPosition,
    localToWorld, worldToView, viewToScreen,
    material.albedo, specularF0, specularF90, material.ior, material.specularRoughness, 
    material.thickness, material.attenuationColor, material.attenuationDistance,
    backgroundTexture );

material.transmissionAlpha = mix( material.transmissionAlpha, transmission.a, material.transmission );

totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );

