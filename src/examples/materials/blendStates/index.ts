import { planeGeometry } from "../../../lib/geometry/primitives/planeGeometry";
import { Blending } from "../../../lib/materials/Blending";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4Concatenation,
  makeMatrix4Scale,
  makeMatrix4Translation,
} from "../../../lib/math/Matrix4.Functions";
import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";
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
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const fgTexture = new Texture(
    await fetchImageElement("/assets/textures/alphaCompositing/fg.svg", new Vector2(1024, 1024)),
  );
  const bgTexture = new Texture(
    await fetchImageElement("/assets/textures/alphaCompositing/bg.svg", new Vector2(1024, 1024)),
  );

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const bgUniforms = {
    localToWorld: new Matrix4(),
    premultipliedAlpha: 0,
    alpha: 1,
    map: makeTexImage2DFromTexture(context, bgTexture),
  };
  const fgUniforms = {
    localToWorld: new Matrix4(),
    premultipliedAlpha: 0,
    alpha: 1,
    map: makeTexImage2DFromTexture(context, fgTexture),
  };

  const geometry = planeGeometry(1, 1, 1, 1);
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  const blendings = [Blending.Over, Blending.Add, Blending.Subtract, Blending.Multiply];
  const premultipliedAlphas = [false, true];

  function animate(): void {
    const time = Date.now();

    premultipliedAlphas.forEach((premultipliedAlpha, pIndex) => {
      blendings.forEach((blending, bIndex) => {
        let localToWorld = makeMatrix4Translation(new Vector3(-0.5 + bIndex / 4, pIndex / 3, 0));
        localToWorld = makeMatrix4Concatenation(localToWorld, makeMatrix4Scale(new Vector3(0.25, 0.25, 0)));

        bgUniforms.localToWorld = localToWorld;
        bgUniforms.premultipliedAlpha = premultipliedAlpha ? 1 : 0;
        canvasFramebuffer.blendState = blendModeToBlendState(Blending.Over, premultipliedAlpha);
        renderBufferGeometry(canvasFramebuffer, program, bgUniforms, bufferGeometry);

        fgUniforms.localToWorld = localToWorld;
        fgUniforms.premultipliedAlpha = premultipliedAlpha ? 1 : 0;
        fgUniforms.alpha = Math.cos(time * 0.001) * 0.5 + 0.5;
        canvasFramebuffer.blendState = blendModeToBlendState(blending, premultipliedAlpha);
        renderBufferGeometry(canvasFramebuffer, program, fgUniforms, bufferGeometry);
      });
    });

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
