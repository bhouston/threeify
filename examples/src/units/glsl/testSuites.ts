import lambertTests from '@threeify/core/dist/shaders/brdfs/diffuse/lambert.test.glsl';
import rgbdTests from '@threeify/core/dist/shaders/color/encodings/rgbd.test.glsl';
import rgbeTests from '@threeify/core/dist/shaders/color/encodings/rgbe.test.glsl';
import srgbTests from '@threeify/core/dist/shaders/color/spaces/srgb.test.glsl';
import cubeFacesTests from '@threeify/core/dist/shaders/cubemaps/cubeFaces.test.glsl';
import latLongTests from '@threeify/core/dist/shaders/cubemaps/latLong.test.glsl';
import mathTests from '@threeify/core/dist/shaders/math.test.glsl';
import mat2Tests from '@threeify/core/dist/shaders/math/mat2.test.glsl';
import mat3Tests from '@threeify/core/dist/shaders/math/mat3.test.glsl';
import mat4Tests from '@threeify/core/dist/shaders/math/mat4.test.glsl';
import structsTests from '@threeify/core/dist/shaders/math/structs.test.glsl';
import unitIntervalPackingTests from '@threeify/core/dist/shaders/math/unitIntervalPacking.test.glsl';
import normalPackingTests from '@threeify/core/dist/shaders/microgeometry/normalPacking.test.glsl';
import refractionTests from '@threeify/core/dist/shaders/raytracing/refraction.test.glsl';

type GLSLTestSuite = {
  name: string;
  source: string;
};

export const glslTestSuites: Array<GLSLTestSuite> = [
  {
    name: 'lambert',
    source: lambertTests
  },
  {
    name: 'rgbd',
    source: rgbdTests
  },
  {
    name: 'rgbe',
    source: rgbeTests
  },
  {
    name: 'srgb',
    source: srgbTests
  },
  {
    name: 'latLong',
    source: latLongTests
  },
  {
    name: 'cubeFaces',
    source: cubeFacesTests
  },
  {
    name: 'structs',
    source: structsTests
  },
  {
    name: 'math',
    source: mathTests
  },
  {
    name: 'mat2',
    source: mat2Tests
  },
  {
    name: 'mat3',
    source: mat3Tests
  },
  {
    name: 'mat4',
    source: mat4Tests
  },
  {
    name: 'normalPacking',
    source: normalPackingTests
  },
  {
    name: 'unitIntervalPacking',
    source: unitIntervalPackingTests
  },
  {
    name: 'refraction',
    source: refractionTests
  }
];
