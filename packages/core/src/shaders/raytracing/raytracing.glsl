#pragma once

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Hit {
    float distance;
    vec3 position;
    vec3 normal;
};

