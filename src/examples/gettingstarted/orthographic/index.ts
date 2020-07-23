import { boxGeometry } from "../../../lib/geometry/primitives/boxGeometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler } from "../../../lib/math/Euler";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4OrthographicSimple,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
} from "../../../lib/math/Matrix4.Functions";
import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
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
  const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -1)),
    viewToScreen: makeMatrix4OrthographicSimple(1.5, new Vector2(), 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),
    viewLightPosition: new Vector3(0, 0, 0),
    map: makeTexImage2DFromTexture(context, texture),
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.001, now * 0.0033, now * 0.00077),
      uniforms.localToWorld,
    );
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry, depthTestState);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
