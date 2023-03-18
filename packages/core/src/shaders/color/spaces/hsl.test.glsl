#pragma import "../../tests/fragment.glsl"
#pragma import "./hsl.glsl"

void testHslToColor(inout TestSuite suite, int testId, vec3 hsl, vec3 expectedRgb) {
    vec3 rgb = hslToColor(hsl.x, hsl.y, hsl.z);
    assert(suite, testId, eqAbs(rgb, expectedRgb, 0.001));
}

void hslTests(inout TestSuite suite) {
    testHslToColor(suite, 1, vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0));
    testHslToColor(suite, 2, vec3(0.0, 1.0, 0.5), vec3(1.0, 0.0, 0.0));
    testHslToColor(suite, 3, vec3(1.0/3.0, 1.0, 0.5), vec3(0.0, 1.0, 0.0));
    testHslToColor(suite, 4, vec3(2.0/3.0, 1.0, 0.5), vec3(0.0, 0.0, 1.0));
    testHslToColor(suite, 5, vec3(1.0/6.0, 1.0, 0.5), vec3(1.0, 1.0, 0.0));
}