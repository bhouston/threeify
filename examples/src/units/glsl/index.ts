import {
  Attachment,
  BufferBit,
  ClearState,
  createRenderingContext,
  DepthTestState,
  Framebuffer,
  frameBufferToPixels,
  makeColorAttachment,
  makeDepthAttachment,
  renderPass,
  ShaderMaterial,
  shaderMaterialToProgram
} from '@threeify/core';
import vertexSource from '@threeify/core/dist/shaders/tests/vertex.glsl';
import { Color3, Vec2 } from '@threeify/math';

import { glslTestSuites } from './testSuites';

async function init(): Promise<void> {
  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const unitUniforms = {};

  const framebufferSize = new Vec2(1024, 1);
  const framebuffer = new Framebuffer(context);
  framebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(context, framebufferSize)
  );
  framebuffer.attach(
    Attachment.Depth,
    makeDepthAttachment(context, framebufferSize)
  );

  framebuffer.clearState = new ClearState(new Color3(0.5, 0.5, 0.5), 0.5);
  framebuffer.depthTestState = DepthTestState.Less;

  const output: string[] = [];

  let totalPasses = 0;
  let totalFailures = 0;
  let totalDuplicates = 0;

  for (const glslUnitTest of glslTestSuites) {
    const passIds = [];
    const failureIds = [];
    const duplicateIds = [];
    let compileError;

    try {
      const passMaterial = new ShaderMaterial(
        'index',
        vertexSource,
        glslUnitTest.source
      );
      const unitProgram = await shaderMaterialToProgram(context, passMaterial);

      framebuffer.clear(BufferBit.All);
      renderPass({
        framebuffer,
        program: unitProgram,
        uniforms: unitUniforms
      });

      const result = frameBufferToPixels(framebuffer) as Uint8Array;

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
    } catch (e) {
      totalFailures++;
      const err = e as Error;
      compileError = err.message !== undefined ? err.message : 'unknown';
    }

    totalPasses += passIds.length;
    totalFailures += failureIds.length;
    totalDuplicates += duplicateIds.length;

    output.push(
      `${glslUnitTest.name}.test.glsl: ${
        passIds.length + failureIds.length + duplicateIds.length
      } tests`
    );
    if (compileError !== undefined) {
      output.push(`  COMPILE FAILED: ${compileError}`);
    } else if (failureIds.length === 0 && duplicateIds.length === 0) {
      output.push('  ALL PASSED');
    }
    if (failureIds.length > 0) {
      output.push(`  ${failureIds.length} FAILED: ${failureIds.join(' ')}`);
    }
    if (duplicateIds.length > 0) {
      output.push(
        `  ${duplicateIds.length} DUPLICATE IDS: ${duplicateIds.join(' ')}`
      );
    }
    output.push('');
  }

  output.push(
    '',
    `SUMMARY: ${totalPasses} PASSES, ${totalFailures} FAILS, ${totalDuplicates} DUPLICATE IDS`
  );

  const textElement = document.getElementById('text');
  if (textElement !== null) {
    textElement.innerHTML = output.join('<br/>');
  }
}

init();
