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

export interface IToneMappingPassProps {
  sourceTexImage2D: TexImage2D;
  exposure: number;
  targetFramebuffer?: VirtualFramebuffer;
  targetTexImage2D?: TexImage2D;
}

export class ToneMappingPass implements IDisposable {
  programPromise: Promise<Program>;
  bufferGeometry: BufferGeometry;

  constructor(public readonly context: RenderingContext) {
    this.programPromise = context.programCache.acquireRef('toneMapping', () => {
      const material = new ShaderMaterial(
        'toneMapping',
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

  async exec(props: IToneMappingPassProps) {
    const { sourceTexImage2D, exposure, targetFramebuffer, targetTexImage2D } =
      props;
    const { context } = sourceTexImage2D;

    const program = await this.programPromise;

    const uniforms = {
      sourceMap: sourceTexImage2D,
      exposure: exposure !== undefined ? 1.0 : exposure
    };

    let localFramebuffer = targetFramebuffer;
    let tempFramebuffer: Framebuffer | undefined = undefined;

    if (targetFramebuffer === undefined && targetTexImage2D !== undefined) {
      tempFramebuffer = new Framebuffer(context);
      tempFramebuffer.attach(Attachment.Color0, targetTexImage2D);
      localFramebuffer = tempFramebuffer;
    }

    if (localFramebuffer === undefined)
      throw new Error('No target framebuffer or texture specified.');

    renderBufferGeometry({
      framebuffer: localFramebuffer,
      program,
      uniforms,
      bufferGeometry: this.bufferGeometry,
      depthTestState: DepthTestState.None,
      blendState: BlendState.None,
      cullingState: CullingState.None
    });

    if (tempFramebuffer !== undefined) {
      tempFramebuffer.dispose();
    }
  }
}
