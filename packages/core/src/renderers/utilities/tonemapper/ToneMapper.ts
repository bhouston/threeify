import { assert } from '../../../core/assert';
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
  renderBufferGeometry,
  renderPass,
  VirtualFramebuffer
} from '../../webgl/framebuffers/VirtualFramebuffer';
import { shaderMaterialToProgram, Program } from '../../webgl/programs/Program';
import { RenderingContext } from '../../webgl/RenderingContext';
import { TexImage2D } from '../../webgl/textures/TexImage2D';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

export interface IToneMapperProps {
  sourceTexImage2D: TexImage2D;
  exposure: number;
  targetFramebuffer: VirtualFramebuffer;
}

export class ToneMapper implements IDisposable {
  programRef: ResourceRef<Program>;
  program: Program | undefined;

  constructor(public readonly context: RenderingContext) {
    this.programRef = context.programCache.acquireRef('toneMapping', (name) => {
      const material = new ShaderMaterial(name, vertexSource, fragmentSource);
      return shaderMaterialToProgram(context, material);
    });
  }

  async ready(): Promise<void> {
    this.program = await this.programRef.promise;
  }

  dispose() {
    this.programRef.dispose();
  }

  exec(props: IToneMapperProps) {
    const program = this.program;
    if (program === undefined) throw new Error(`Program ${this.programRef.id} is not ready.`);

    const { sourceTexImage2D, exposure, targetFramebuffer } = props;

    assert(exposure > 0);

    const uniforms = {
      sourceMap: sourceTexImage2D,
      exposure: exposure
    };

    renderPass({
      framebuffer: targetFramebuffer,
      program,
      uniforms
    });
  }
}
