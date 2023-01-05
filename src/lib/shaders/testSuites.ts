import lambertTests from './includes/brdfs/diffuse/lambert.test.glsl';
import rgbdTests from './includes/color/encodings/rgbd.test.glsl';
import rgbeTests from './includes/color/encodings/rgbe.test.glsl';
import srgbTests from './includes/color/spaces/srgb.test.glsl';
import cubeFacesTests from './includes/cubemaps/cubeFaces.test.glsl';
import latLongTests from './includes/cubemaps/latLong.test.glsl';
import mat2Tests from './includes/math/mat2.test.glsl';
import mat3Tests from './includes/math/mat3.test.glsl';
import mat4Tests from './includes/math/mat4.test.glsl';
import mathTests from './includes/math/math.test.glsl';
import structsTests from './includes/math/structs.test.glsl';
import unitIntervalPackingTests from './includes/math/unitIntervalPacking.test.glsl';
import normalPackingTests from './includes/normals/normalPacking.test.glsl';

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
