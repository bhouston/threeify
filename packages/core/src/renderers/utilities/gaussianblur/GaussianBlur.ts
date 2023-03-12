import { Vec2, vec2Equals } from '@threeify/math';

import { assert } from '../../../core/assert';
import { using } from '../../../core/using';
import { IDisposable } from '../../../core/types';
import { PassGeometry } from '../../../geometry/primitives/passGeometry';
import { ShaderMaterial } from '../../../materials/ShaderMaterial';
import { ResourceRef } from '../../caches/ResourceCache';
import { BlendState } from '../../webgl/BlendState';
import {
  BufferGeometry,
  geometryToBufferGeometry
} from '../../webgl/buffers/BufferGeometry';
import { CullingState } from '../../webgl/CullingState';
import { DepthTestState } from '../../webgl/DepthTestState';
import {
  colorAttachmentToFramebuffer,
  Framebuffer
} from '../../webgl/framebuffers/Framebuffer';
import {
  renderBufferGeometry,
  renderPass
} from '../../webgl/framebuffers/VirtualFramebuffer';
import { shaderMaterialToProgram, Program } from '../../webgl/programs/Program';
import { RenderingContext } from '../../webgl/RenderingContext';
import { TexImage2D } from '../../webgl/textures/TexImage2D';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

export interface IGaussianBlurProps {
  sourceTexImage2D: TexImage2D;
  sourceLod: number;
  standardDeviationInTexels: number;
  tempTexImage2D: TexImage2D;
  targetFramebuffer: Framebuffer;
  targetAlpha: number;
}

export class GaussianBlur implements IDisposable {
  programRef: ResourceRef<Program>;
  program: Program | undefined;

  constructor(public readonly context: RenderingContext) {
    this.programRef = context.programCache.acquireRef(
      'gaussianBlur',
      (name) => {
        const material = new ShaderMaterial(name, vertexSource, fragmentSource);
        return shaderMaterialToProgram(context, material);
      }
    );
  }

  async ready(): Promise<void> {
    this.program = await this.programRef.promise;
  }

  dispose() {
    this.programRef.dispose();
  }

  async exec(
    props = {
      sourceLod: 0,
      standardDeviationInTexels: 3,
      targetAlpha: 1
    } as IGaussianBlurProps
  ) {
    const program = this.program;
    if (program === undefined)
      throw new Error(`Program ${this.programRef.id} is not ready.`);

    const {
      sourceTexImage2D,
      sourceLod,
      standardDeviationInTexels,
      tempTexImage2D,
      targetFramebuffer,
      targetAlpha
    } = props;

    assert(sourceLod >= 0);
    assert(standardDeviationInTexels >= 0);
    assert(
      vec2Equals(tempTexImage2D.size, targetFramebuffer.size),
      'Temp texture size does not match target size.'
    );
    assert(0 <= targetAlpha && targetAlpha <= 1);

    const uniforms = {
      sourceMap: sourceTexImage2D,
      sourceLod: sourceLod,
      standardDeviationInTexels: standardDeviationInTexels,
      kernelRadiusInTexels: Math.ceil(standardDeviationInTexels * 3),
      blurDirection: new Vec2(1, 0),
      targetAlpha: 1
    };

    using(colorAttachmentToFramebuffer(tempTexImage2D), (tempFramebuffer) => {
      renderPass({
        framebuffer: tempFramebuffer,
        program,
        uniforms
      });
    });

    uniforms.blurDirection.set(0, 1);
    uniforms.sourceMap = tempTexImage2D;
    uniforms.targetAlpha = targetAlpha;

    renderPass({
      framebuffer: targetFramebuffer,
      program,
      uniforms,
      blendState:
        targetAlpha < 1.0 ? BlendState.PremultipliedOver : BlendState.None
    });
  }
}
