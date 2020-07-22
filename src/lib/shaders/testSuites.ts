import lambertTests from "./includes/brdfs/diffuse/lambert.test.glsl";
import rgbdTests from "./includes/color/encodings/rgbd.test.glsl";
import rgbeTests from "./includes/color/encodings/rgbe.test.glsl";
import srgbTests from "./includes/color/spaces/srgb.test.glsl";
import equirectangularTests from "./includes/cubemaps/equirectangular.test.glsl";
import mathTests from "./includes/math/math.test.glsl";
import unitIntervalPackingTests from "./includes/math/unitIntervalPacking.test.glsl";
import packingTests from "./includes/normals/packing.test.glsl";

type GLSLTestSuite = {
  name: string;
  source: string;
};

export const glslTestSuites: Array<GLSLTestSuite> = [
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
  {
    name: "unitIntervalPacking",
    source: unitIntervalPackingTests,
  },
];
