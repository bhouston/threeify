import { passGeometry } from "../../../lib/geometry/primitives/passGeometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { ClearState } from "../../../lib/renderers/webgl/ClearState";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { Attachment } from "../../../lib/renderers/webgl/framebuffers/Attachment";
import { BufferBit } from "../../../lib/renderers/webgl/framebuffers/BufferBit";
import {
  Framebuffer,
  makeColorAttachment,
  makeDepthAttachment,
} from "../../../lib/renderers/webgl/framebuffers/Framebuffer";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import rgbeTests from "../../../lib/shaders/includes/color/spaces/rgbe.tests.glsl";
import srgbTests from "../../../lib/shaders/includes/color/spaces/srgb.tests.glsl";
import equirectangularTests from "../../../lib/shaders/includes/cubemaps/equirectangular.tests.glsl";
import mathTests from "../../../lib/shaders/includes/math/math.tests.glsl";
import packingTests from "../../../lib/shaders/includes/normals/packing.tests.glsl";
import vertexSource from "../../../lib/shaders/includes/unit/vertex.glsl";

async function init(): Promise<null> {
  const geometry = passGeometry();
  const tests = [mathTests, packingTests, rgbeTests, equirectangularTests, srgbTests];

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const unitUniforms = {};

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  const framebufferSize = new Vector2(8, 8);

  const framebuffer = new Framebuffer(context);
  framebuffer.attach(Attachment.Color0, makeColorAttachment(context, framebufferSize));
  framebuffer.attach(Attachment.Depth, makeDepthAttachment(context, framebufferSize));

  framebuffer.clearState = new ClearState(new Vector3(0.5, 0.5, 0.5), 0.5);
  framebuffer.depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  tests.forEach((testFragmentSource) => {
    const passMaterial = new ShaderMaterial(vertexSource, testFragmentSource);
    const unitProgram = makeProgramFromShaderMaterial(context, passMaterial);

    framebuffer.clear(BufferBit.All);
    framebuffer.renderBufferGeometry(unitProgram, unitUniforms, bufferGeometry);

    const result = framebuffer.readPixels() as Uint8Array;
    for (let i = 0; i < result.length; i += 4) {
      if (result[i + 1] > 0) {
        console.log("unit test successes: ", result[i]);
        console.log("unit test failures: ", result[i + 1]);
        console.log("first unit test is: ", result[i + 2]);
        break;
      }
    }
  });

  return null;
}

init();
