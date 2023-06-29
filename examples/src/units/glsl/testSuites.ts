import lambertTests from '@threeify/core/dist/shaders/brdfs/diffuse/lambert.test.glsl.js';
import rgbdTests from '@threeify/core/dist/shaders/color/encodings/rgbd.test.glsl.js';
import rgbeTests from '@threeify/core/dist/shaders/color/encodings/rgbe.test.glsl.js';
import srgbTests from '@threeify/core/dist/shaders/color/spaces/srgb.test.glsl.js';
import cubeFacesTests from '@threeify/core/dist/shaders/cubemaps/cubeFaces.test.glsl.js';
import latLongTests from '@threeify/core/dist/shaders/cubemaps/latLong.test.glsl.js';
import mathTests from '@threeify/core/dist/shaders/math.test.glsl.js';
import mat2Tests from '@threeify/core/dist/shaders/math/mat2.test.glsl.js';
import mat3Tests from '@threeify/core/dist/shaders/math/mat3.test.glsl.js';
import mat4Tests from '@threeify/core/dist/shaders/math/mat4.test.glsl.js';
import structsTests from '@threeify/core/dist/shaders/math/structs.test.glsl.js';
import unitIntervalPackingTests from '@threeify/core/dist/shaders/math/unitIntervalPacking.test.glsl.js';
import normalPackingTests from '@threeify/core/dist/shaders/microgeometry/normalPacking.test.glsl.js';

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
  }
];
