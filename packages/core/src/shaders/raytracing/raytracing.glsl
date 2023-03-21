#pragma once

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Hit {
    float t;
    vec3 position;
    vec3 normal;
};
