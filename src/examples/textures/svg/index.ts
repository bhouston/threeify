import { planeGeometry } from "../../../lib/geometry/primitives/planeGeometry";
import { Blending } from "../../../lib/materials/Blending";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Vector2 } from "../../../lib/math/Vector2";
import { blendModeToBlendState } from "../../../lib/renderers/webgl/BlendState";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { renderBufferGeometry } from "../../../lib/renderers/webgl/framebuffers/VirtualFramebuffer";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { fetchImageElement } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const fgTexture = new Texture(
    await fetchImageElement("/assets/textures/alphaCompositing/fg75.svg", new Vector2(1024, 1024)),
  );
  const bgTexture = new Texture(
    await fetchImageElement("/assets/textures/alphaCompositing/bg.svg", new Vector2(1024, 1024)),
  );
  const material = new ShaderMaterial(vertexSource, fragmentSource);

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  context.blendState = blendModeToBlendState(Blending.Over, true);

  const program = makeProgramFromShaderMaterial(context, material);
  const bgUniforms = { map: makeTexImage2DFromTexture(context, bgTexture) };
  const fgUniforms = { map: makeTexImage2DFromTexture(context, fgTexture) };

  const geometry = planeGeometry(1, 1, 1, 1);
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  renderBufferGeometry(canvasFramebuffer, program, bgUniforms, bufferGeometry);
  renderBufferGeometry(canvasFramebuffer, program, fgUniforms, bufferGeometry);

  return null;
}

init();
