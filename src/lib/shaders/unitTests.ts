import lambertTests from "./includes/brdfs/diffuse/lambert.tests.glsl";
import rgbdTests from "./includes/color/encodings/rgbd.tests.glsl";
import rgbeTests from "./includes/color/encodings/rgbe.tests.glsl";
import srgbTests from "./includes/color/spaces/srgb.tests.glsl";
import equirectangularTests from "./includes/cubemaps/equirectangular.tests.glsl";
import mathTests from "./includes/math/math.tests.glsl";
import packingTests from "./includes/normals/packing.tests.glsl";

type GLSLUnitTest = {
  name: string;
  source: string;
};

export const glslUnitTests: Array<GLSLUnitTest> = [
  {
    name: "lambert",
    source: lambertTests,
  },
  {
    name: "rgbd",
    source: rgbdTests,
  },
  {
    name: "rgbe",
    source: rgbeTests,
  },
  {
    name: "srgb",
    source: srgbTests,
  },
  {
    name: "equirectangular",
    source: equirectangularTests,
  },
  {
    name: "math",
    source: mathTests,
  },
  {
    name: "packing",
    source: packingTests,
  },
];
