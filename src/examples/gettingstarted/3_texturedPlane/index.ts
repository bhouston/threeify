import { plane } from "../../../lib/geometry/primitives/Plane";
import { fetchImage } from "../../../lib/io/loaders/Image";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Program, RenderingContext, TexImage2D } from "../../../lib/renderers/webgl2";
import { BufferGeometry } from "../../../lib/renderers/webgl2/buffers/BufferGeometry";
import { Texture } from "../../../lib/textures";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = plane(1, 1, 1, 1);
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));

  const context = new RenderingContext();
  const canvasFramebuffer = context.canvasFramebuffer;
  document.body.appendChild(canvasFramebuffer.canvas);

  const bufferGeometry = new BufferGeometry(context, geometry);
  const program = new Program(context, material);
  const texImage2D = new TexImage2D(context, texture);
  const uniforms = { map: texImage2D };

  canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);

  return null;
}

init();
