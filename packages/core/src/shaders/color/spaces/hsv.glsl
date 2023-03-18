
vec3 hsvToColor(float hue, float saturation, float value) {
    float chroma = value * saturation;
    float hueSection = hue * 6.0;
    float x = chroma * (1.0 - abs(mod(hueSection, 2.0) - 1.0));
    vec3 color;

    if (hueSection < 1.0) {
        color = vec3(chroma, x, 0.0);
    } else if (hueSection < 2.0) {
        color = vec3(x, chroma, 0.0);
    } else if (hueSection < 3.0) {
        color = vec3(0.0, chroma, x);
    } else if (hueSection < 4.0) {
        color = vec3(0.0, x, chroma);
    } else if (hueSection < 5.0) {
        color = vec3(x, 0.0, chroma);
    } else {
        color = vec3(chroma, 0.0, x);
    }

    float matchValue = value - chroma;
    return color + vec3(matchValue);
}