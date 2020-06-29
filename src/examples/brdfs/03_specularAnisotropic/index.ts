import { disk } from "../../../lib/geometry/primitives/disk";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler, EulerOrder } from "../../../lib/math/Euler";
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
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = disk(0.5, 64);
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const anisotropicFlow1Texture = new Texture(
    await fetchImage("/assets/textures/anisotropic/radialSmallOverlapping.jpg"),
  );
  const anisotropicFlow2Texture = new Texture(await fetchImage("/assets/textures/anisotropic/radialLarge.jpg"));

  const context = new RenderingContext();
  const canvasFramebuffer = context.canvasFramebuffer;
  if (canvasFramebuffer.canvas instanceof HTMLCanvasElement) {
    document.body.appendChild(canvasFramebuffer.canvas);
  }
  const anisotropicFlow1Map = makeTexImage2DFromTexture(context, anisotropicFlow1Texture);
  const anisotropicFlow2Map = makeTexImage2DFromTexture(context, anisotropicFlow2Texture);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -1.0)),
    viewToScreen: makeMatrix4PerspectiveFov(35, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),

    // lights
    pointLightViewPosition: new Vector3(0.0, 0, 0.0),
    pointLightColor: new Vector3(1, 1, 1).multiplyByScalar(0.7),
    pointLightRange: 6.0,

    // materials
    specularAnisotropicFlowModulator: 1.0,
    specularAnisotropicFlowMap: anisotropicFlow1Map,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(Math.cos(now * 0.0) * 0.7 * Math.PI, 0, now * 0.0006, EulerOrder.YXZ),
      uniforms.localToWorld,
    );
    uniforms.specularAnisotropicFlowMap = Math.floor(now / 5000) % 2 === 0 ? anisotropicFlow1Map : anisotropicFlow2Map;
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
