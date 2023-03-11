import { IDisposable } from '../../core/types';
import { PassGeometry } from '../../geometry/primitives/passGeometry';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { ResourceRef } from '../../renderers/caches/ResourceCache';
import { BlendState } from '../webgl/BlendState';
import {
  BufferGeometry,
  geometryToBufferGeometry
} from '../webgl/buffers/BufferGeometry';
import { CullingState } from '../webgl/CullingState';
import { DepthTestState } from '../webgl/DepthTestState';
import { Attachment } from '../webgl/framebuffers/Attachment';
import { Framebuffer } from '../webgl/framebuffers/Framebuffer';
import {
  renderBufferGeometry,
  renderPass,
  VirtualFramebuffer
} from '../webgl/framebuffers/VirtualFramebuffer';
import {
  shaderMaterialToProgram,
  Program
} from '../webgl/programs/Program';
import { RenderingContext } from '../webgl/RenderingContext';
import { TexImage2D } from '../webgl/textures/TexImage2D';
import fragmentSource from './copy/fragment.glsl';
import vertexSource from './copy/vertex.glsl';
import { TextureEncoding } from './TextureEncoding';

export interface ICopyPassProps {
  sourceTexImage2D: TexImage2D;
  sourceEncoding?: TextureEncoding;
  targetFramebuffer?: VirtualFramebuffer;
  targetTexImage2D?: TexImage2D;
  targetEncoding?: TextureEncoding;
}

export class CopyPass implements IDisposable {
  programRef: ResourceRef<Program>;
  program: Program | undefined;
  bufferGeometryRef: ResourceRef<BufferGeometry>;
  bufferGeometry: BufferGeometry | undefined;

  constructor(public readonly context: RenderingContext) {
    this.programRef = context.programCache.acquireRef('copyPass', (name) => {
      const material = new ShaderMaterial(name, vertexSource, fragmentSource);
      return shaderMaterialToProgram(context, material);
    });
      this.bufferGeometryRef = context.bufferGeometryCache.acquireRef(
        'pass',
        (name) => {
          return new Promise<BufferGeometry>((resolve) => {
            return resolve(geometryToBufferGeometry(context, PassGeometry));
          });
        }
      );
  }

  async ready(): Promise<void> {
    this.program = await this.programRef.promise;
    this.bufferGeometry = await this.bufferGeometryRef.promise;
  }

  dispose() {
    this.programRef.dispose();
  }

  exec(props: ICopyPassProps) {
     const program = this.program;
     if (program === undefined) throw new Error('Program is not ready.');

    const {
      sourceTexImage2D,
      sourceEncoding,
      targetFramebuffer,
      targetTexImage2D,
      targetEncoding
    } = props;
    const { context } = sourceTexImage2D;

    if (targetFramebuffer !== undefined && targetTexImage2D !== undefined) {
      throw new Error('Cannot specify both a target framebuffer and texture.');
    }

    const uniforms = {
      sourceMap: sourceTexImage2D,
      sourceEncoding:
        sourceEncoding !== undefined ? sourceEncoding : TextureEncoding.Linear,
      targetEncoding:
        targetEncoding !== undefined ? targetEncoding : TextureEncoding.Linear
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

    renderPass({
      framebuffer: localFramebuffer,
      program,
      uniforms
    });

    if (tempFramebuffer !== undefined) {
      tempFramebuffer.dispose();
    }
  }
}
