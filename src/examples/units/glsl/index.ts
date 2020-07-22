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
import vertexSource from "../../../lib/shaders/includes/tests/vertex.glsl";
import { glslTestSuites } from "../../../lib/shaders/testSuites";

async function init(): Promise<null> {
  const geometry = passGeometry();

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const unitUniforms = {};
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  const framebufferSize = new Vector2(1024, 1);
  const framebuffer = new Framebuffer(context);
  framebuffer.attach(Attachment.Color0, makeColorAttachment(context, framebufferSize));
  framebuffer.attach(Attachment.Depth, makeDepthAttachment(context, framebufferSize));

  framebuffer.clearState = new ClearState(new Vector3(0.5, 0.5, 0.5), 0.5);
  framebuffer.depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  const output: string[] = [];

  glslTestSuites.forEach((glslUnitTest) => {
    const passMaterial = new ShaderMaterial(vertexSource, glslUnitTest.source);
    const unitProgram = makeProgramFromShaderMaterial(context, passMaterial);

    framebuffer.clear(BufferBit.All);
    framebuffer.renderBufferGeometry(unitProgram, unitUniforms, bufferGeometry);

    const result = framebuffer.readPixels() as Uint8Array;

    const passIds = [];
    const failureIds = [];
    const duplicateIds = [];

    for (let i = 0; i < result.length; i += 4) {
      const runResult = result[i + 2];
      const id = i / 4;
      switch (runResult) {
        case 0:
          failureIds.push(id);
          break;
        case 1:
          passIds.push(id);
          break;
        case 3:
          duplicateIds.push(id);
          break;
      }
    }

    output.push(`${glslUnitTest.name}.tests.glsl: ${passIds.length + failureIds.length + duplicateIds.length} tests`);
    if (passIds.length > 0) {
      output.push(`  ${passIds.length} passed`);
    }
    if (failureIds.length > 0) {
      output.push(`  ${failureIds.length} failed: ${failureIds.join(" ")}`);
    }
    if (duplicateIds.length > 0) {
      output.push(`  ${duplicateIds.length} duplicate test ids: ${duplicateIds.join(" ")}`);
    }
    output.push("");
  });

  const textElement = document.getElementById("text");
  if (textElement !== null) {
    textElement.innerHTML = output.join("<br/>");
  }

  return null;
}

init();
