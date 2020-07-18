import rgbeTests from "./includes/color/spaces/rgbe.tests.glsl";
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
