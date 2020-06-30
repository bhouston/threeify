import { convertToInterleavedGeometry } from "../../../lib/geometry/Geometry.Functions";
import { icosahedron } from "../../../lib/geometry/primitives/polyhedrons";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler } from "../../../lib/math/Euler";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
} from "../../../lib/math/Matrix4.Functions";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromCubeTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { CubeTexture } from "../../../lib/textures/CubeTexture";
import { fetchHDR } from "../../../lib/textures/loaders/HDR";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = convertToInterleavedGeometry(icosahedron(0.75, 3));
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const cubeTexture = new CubeTexture([
    await fetchHDR("/assets/textures/cube/pisaHDR/px.hdr"),
    await fetchHDR("/assets/textures/cube/pisaHDR/nx.hdr"),
    await fetchHDR("/assets/textures/cube/pisaHDR/py.hdr"),
    await fetchHDR("/assets/textures/cube/pisaHDR/ny.hdr"),
    await fetchHDR("/assets/textures/cube/pisaHDR/pz.hdr"),
    await fetchHDR("/assets/textures/cube/pisaHDR/nz.hdr"),
  ]);

  const context = new RenderingContext();
  const canvasFramebuffer = context.canvasFramebuffer;
  if (canvasFramebuffer.canvas instanceof HTMLCanvasElement) {
    document.body.appendChild(canvasFramebuffer.canvas);
  }
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -1)),
    viewToScreen: makeMatrix4PerspectiveFov(60, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),
    perceptualRoughness: 0,
    mipCount: cubeTexture.mipCount,
    cubeMap: makeTexImage2DFromCubeTexture(context, cubeTexture),
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld,
    );
    uniforms.perceptualRoughness = Math.sin(now * 0.001) * 0.5 + 0.5;
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
