import { planeGeometry } from "../../../lib/geometry/primitives/planeGeometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Matrix4 } from "../../../lib/math/Matrix4";
import { makeMatrix4PerspectiveFov, makeMatrix4Translation } from "../../../lib/math/Matrix4.Functions";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../../lib/renderers/webgl/ClearState";
import { CullingState } from "../../../lib/renderers/webgl/CullingState";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { AttachmentBits } from "../../../lib/renderers/webgl/framebuffers/AttachmentBits";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = planeGeometry(3, 3);
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));

  const context = new RenderingContext();
  const canvasFramebuffer = context.canvasFramebuffer;
  if (canvasFramebuffer.canvas instanceof HTMLCanvasElement) {
    document.body.appendChild(canvasFramebuffer.canvas);
  }
  const map = makeTexImage2DFromTexture(context, texture);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3.0)),
    viewToScreen: makeMatrix4PerspectiveFov(25, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),

    // lights
    pointLightViewPosition: new Vector3(0.0, 0, 0.0),
    pointLightViewDirection: new Vector3(0.0, 0, -1.0),
    pointLightColor: new Vector3(1, 1, 1).multiplyByScalar(10.0),
    pointLightRange: 15.0,
    pointLightInnerCos: 1.0,
    pointLightOuterCos: Math.cos(Math.PI * 0.5),

    // materials
    albedoMap: map,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 1.0);
  canvasFramebuffer.cullingState = new CullingState(true);

  function animate(): void {
    const now = Date.now();

    /* uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(0.15 * Math.PI, now * 0.0002, 0, EulerOrder.XZY),
      uniforms.localToWorld,
    );*/
    uniforms.pointLightInnerCos = Math.cos(Math.PI * 0.05 * Math.cos(now * 0.0023));
    uniforms.pointLightOuterCos = uniforms.pointLightInnerCos * Math.cos(Math.PI * 0.05 * Math.cos(now * 0.0017));
    uniforms.pointLightViewPosition = new Vector3(Math.cos(now * 0.001) * 0.5, Math.cos(now * 0.00087) * 0.5, 1.5);

    canvasFramebuffer.clear(AttachmentBits.All);
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
