import { Vec2, vec2Equals } from '@threeify/math';

import { assert } from '../../core/assert';
import { IDisposable } from '../../core/types';
import { PassGeometry } from '../../geometry/primitives/passGeometry';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { ResourceRef } from '../caches/ResourceCache';
import { BlendState } from '../webgl/BlendState';
import {
  BufferGeometry,
  makeBufferGeometryFromGeometry as geometryToBufferGeometry
} from '../webgl/buffers/BufferGeometry';
import { CullingState } from '../webgl/CullingState';
import { DepthTestState } from '../webgl/DepthTestState';
import { colorAttachmentToFramebuffer } from '../webgl/framebuffers/Framebuffer';
import { renderBufferGeometry } from '../webgl/framebuffers/VirtualFramebuffer';
import {
  makeProgramFromShaderMaterial as shaderMaterialToProgram,
  Program
} from '../webgl/programs/Program';
import { RenderingContext } from '../webgl/RenderingContext';
import { TexImage2D } from '../webgl/textures/TexImage2D';
import fragmentSource from './toneMapping/fragment.glsl';
import vertexSource from './toneMapping/vertex.glsl';

export interface IGaussianBlurProps {
  sourceTexImage2D: TexImage2D;
  sourceLod: number;
  standardDeviation: number;

  tempTexImage2D: TexImage2D;
  targetTexImage2D: TexImage2D;
}

export class GaussianBlur implements IDisposable {
  programRef: ResourceRef<Program>;
  bufferGeometry: BufferGeometry;

  constructor(public readonly context: RenderingContext) {
    this.programRef = context.programCache.acquireRef(
      'gaussianSparableBlur',
      (name) => {
        const material = new ShaderMaterial(name, vertexSource, fragmentSource);
        return shaderMaterialToProgram(context, material);
      }
    );
    this.bufferGeometry = geometryToBufferGeometry(context, PassGeometry);
  }

  dispose() {
    this.programRef.dispose();
  }

  async exec(props: IGaussianBlurProps) {
    const {
      sourceTexImage2D,
      sourceLod,
      standardDeviation,
      tempTexImage2D,
      targetTexImage2D
    } = props;

    assert(sourceLod >= 0);
    assert(standardDeviation >= 0);
    assert(
      vec2Equals(tempTexImage2D.size, targetTexImage2D.size),
      'Temp texture size does not match target size.'
    );

    const program = await this.programRef.promise;

    const uniforms = {
      sourceMap: sourceTexImage2D,
      sourceLod: sourceLod,
      standardDeviation: standardDeviation,
      kernelRadius: Math.ceil(standardDeviation * 3),
      direction: new Vec2(1, 0)
    };

    using(colorAttachmentToFramebuffer(tempTexImage2D), (tempFramebuffer) => {
      renderBufferGeometry({
        framebuffer: tempFramebuffer,
        program,
        uniforms,
        bufferGeometry: this.bufferGeometry,
        depthTestState: DepthTestState.None,
        blendState: BlendState.None,
        cullingState: CullingState.None
      });
    });

    uniforms.direction = new Vec2(0, 1);
    uniforms.sourceMap = tempTexImage2D;

    using(
      colorAttachmentToFramebuffer(targetTexImage2D),
      (targetFramebuffer) => {
        renderBufferGeometry({
          framebuffer: targetFramebuffer,
          program,
          uniforms,
          bufferGeometry: this.bufferGeometry,
          depthTestState: DepthTestState.None,
          blendState: BlendState.None,
          cullingState: CullingState.None
        });
      }
    );
  }
}
