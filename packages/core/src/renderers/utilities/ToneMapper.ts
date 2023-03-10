import { assert } from '../../core/assert';
import { IDisposable } from '../../core/types';
import { PassGeometry } from '../../geometry/primitives/passGeometry';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { BlendState } from '../webgl/BlendState';
import {
  BufferGeometry,
  makeBufferGeometryFromGeometry
} from '../webgl/buffers/BufferGeometry';
import { CullingState } from '../webgl/CullingState';
import { DepthTestState } from '../webgl/DepthTestState';
import { Attachment } from '../webgl/framebuffers/Attachment';
import { Framebuffer } from '../webgl/framebuffers/Framebuffer';
import {
  renderBufferGeometry,
  VirtualFramebuffer
} from '../webgl/framebuffers/VirtualFramebuffer';
import {
  makeProgramFromShaderMaterial,
  Program
} from '../webgl/programs/Program';
import { RenderingContext } from '../webgl/RenderingContext';
import { TexImage2D } from '../webgl/textures/TexImage2D';
import fragmentSource from './toneMapping/fragment.glsl';
import vertexSource from './toneMapping/vertex.glsl';

export interface IToneMapperProps {
  sourceTexImage2D: TexImage2D;
  exposure: number;
  targetFramebuffer: VirtualFramebuffer;
}

export class ToneMapper implements IDisposable {
  programPromise: Promise<Program>;
  bufferGeometry: BufferGeometry;

  constructor(public readonly context: RenderingContext) {
    this.programPromise = context.programCache.acquireRef('toneMapping', (name) => {
      const material = new ShaderMaterial(
        name,
        vertexSource,
        fragmentSource
      );
      return makeProgramFromShaderMaterial(context, material);
    });
    this.bufferGeometry = makeBufferGeometryFromGeometry(context, PassGeometry);
  }

  dispose() {
    this.context.programCache.releaseRef('copyPass');
  }

  async exec(props: IToneMapperProps) {
    const { sourceTexImage2D, exposure, targetFramebuffer } = props;

    assert( exposure > 0 );

    const program = await this.programPromise;

    const uniforms = {
      sourceMap: sourceTexImage2D,
      exposure: exposure
    };

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
}
