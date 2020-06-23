import { plane } from "../../../lib/geometry/primitives/Plane";
import { fetchImage } from "../../../lib/io/loaders/Image";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl2/buffers/BufferGeometry";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl2/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl2/RenderingContext";
import { TexImage2D } from "../../../lib/renderers/webgl2/textures/TexImage2D";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = plane(1, 1, 1, 1);
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));

  const context = new RenderingContext();
  const canvasFramebuffer = context.canvasFramebuffer;
  document.body.appendChild(canvasFramebuffer.canvas);

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = { map: new TexImage2D(context, texture) };

  canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry);

  return null;
}

init();
