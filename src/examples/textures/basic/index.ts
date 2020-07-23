import { planeGeometry } from "../../../lib/geometry/primitives/planeGeometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { renderBufferGeometry } from "../../../lib/renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = planeGeometry(1, 1, 1, 1);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = { map: makeTexImage2DFromTexture(context, texture) };

  renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);

  return null;
}

init();
