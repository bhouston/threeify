import { boxGeometry } from "../../../lib/geometry/primitives/boxGeometry";
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
import { ClearState } from "../../../lib/renderers/webgl/ClearState";
import { CullingState } from "../../../lib/renderers/webgl/CullingState";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { BufferBit } from "../../../lib/renderers/webgl/framebuffers/BufferBit";
import { renderBufferGeometry } from "../../../lib/renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const albedoTexture = new Texture(await fetchImage("/assets/textures/bricks/albedo.jpg"));
  const bumpTexture = new Texture(await fetchImage("/assets/textures/bricks/bump.jpg"));
  const specularRoughnessTexture = new Texture(await fetchImage("/assets/textures/bricks/roughness.jpg"));

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -2.0)),
    viewToScreen: makeMatrix4PerspectiveFov(25, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),

    // lights
    pointLightViewPosition: new Vector3(2.0, 0, 3.0),
    pointLightIntensity: new Vector3(1, 1, 1).multiplyByScalar(10.0),
    pointLightRange: 12.0,

    // materials
    albedoMap: makeTexImage2DFromTexture(context, albedoTexture),
    bumpMap: makeTexImage2DFromTexture(context, bumpTexture),
    specularRoughnessMap: makeTexImage2DFromTexture(context, specularRoughnessTexture),
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 1.0);
  canvasFramebuffer.cullingState = new CullingState(true);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(0.15 * Math.PI, now * 0.0002, 0, EulerOrder.XZY),
      uniforms.localToWorld,
    );
    uniforms.pointLightViewPosition = new Vector3(Math.cos(now * 0.001) * 3.0, Math.cos(now * 0.002) * 2.0, 0.5);

    canvasFramebuffer.clear(BufferBit.All);
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
