import { DeviceOrientation } from "../../../lib/controllers/DeviceOrientation";
import { boxGeometry } from "../../../lib/geometry/primitives/boxGeometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4Inverse,
  makeMatrix4Perspective,
  makeMatrix4RotationFromQuaternion,
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
    viewToScreen: makeMatrix4Perspective(-0.25, 0.25, 0.25, -0.25, 0.1, 4.0),
    viewLightPosition: new Vector3(0, 0, 0),
    map: makeTexImage2DFromTexture(context, texture),
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  let deviceOrientation: DeviceOrientation | undefined = undefined;

  const body = document.getElementsByTagName("body")[0];
  body.addEventListener(
    "click",
    () => {
      if (deviceOrientation === undefined) {
        deviceOrientation = new DeviceOrientation();
      }
    },
    false,
  );

  function animate(): void {
    requestAnimationFrame(animate);

    if (deviceOrientation !== undefined) {
      uniforms.localToWorld = makeMatrix4Inverse(makeMatrix4RotationFromQuaternion(deviceOrientation.orientation));
    }
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
