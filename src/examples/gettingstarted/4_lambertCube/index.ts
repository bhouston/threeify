import { box } from "../../../lib/geometry/primitives/Box";
import { fetchImage } from "../../../lib/io/loaders/Image";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler } from "../../../lib/math/Euler3";
import { Matrix4 } from "../../../lib/math/Matrix4";
import { Vector3 } from "../../../lib/math/Vector3";
import { DepthTestFunc, DepthTestState, Program, RenderingContext, TexImage2D } from "../../../lib/renderers/webgl2";
import { BufferGeometry } from "../../../lib/renderers/webgl2/buffers/BufferGeometry";
import { Texture } from "../../../lib/textures";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = box(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));

  const context = new RenderingContext();
  const canvasFramebuffer = context.canvasFramebuffer;
  document.body.appendChild(canvasFramebuffer.canvas);

  const bufferGeometry = new BufferGeometry(context, geometry);
  const program = new Program(context, material);
  const texImage2D = new TexImage2D(context, texture);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: new Matrix4().makeTranslation(new Vector3(0, 0, -1)),
    viewToScreen: new Matrix4().makePerspectiveProjection(-0.25, 0.25, 0.25, -0.25, 0.1, 4.0),
    viewLightPosition: new Vector3(0, 0, 0),
    map: texImage2D,
  };

  canvasFramebuffer.depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    uniforms.localToWorld.makeRotationFromEuler(new Euler(now * 0.001, now * 0.0033, now * 0.00077));
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);
  }

  animate();

  return null;
}

init();
