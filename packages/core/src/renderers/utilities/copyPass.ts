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
import { TexImage2D } from '../webgl/textures/TexImage2D';
import copyFragmentSource from './copy/fragment.glsl';
import copyVertexSource from './copy/vertex.glsl';
import { TextureEncoding } from './TextureEncoding';

let program: Program | undefined;
let passBufferGeometry: BufferGeometry | undefined;

export interface ICopyPassProps {
  sourceTexImage2D: TexImage2D;
  sourceEncoding?: TextureEncoding;
  targetFramebuffer?: VirtualFramebuffer;
  targetTexImage2D?: TexImage2D;
  targetEncoding?: TextureEncoding;
}

export function copyPass(props: ICopyPassProps): void {
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

  // TODO: cache geometry + bufferGeometry.
  if (passBufferGeometry === undefined) {
    passBufferGeometry = makeBufferGeometryFromGeometry(context, PassGeometry);
  }

  // TODO: cache material + program.
  if (program === undefined) {
    const material = new ShaderMaterial(
      'copyPass',
      copyVertexSource,
      copyFragmentSource
    );
    program = makeProgramFromShaderMaterial(context, material);
  }

  const uniforms = {
    sourceMap: sourceTexImage2D,
    sourceEncoding:
      sourceEncoding !== undefined ? sourceEncoding : TextureEncoding.Linear,
    targetEncoding:
      targetEncoding !== undefined ? targetEncoding : TextureEncoding.Linear
  };
  console.log('uniforms', uniforms);
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
    bufferGeometry: passBufferGeometry,
    depthTestState: DepthTestState.None,
    blendState: BlendState.None,
    cullingState: CullingState.None
  });

  if (tempFramebuffer !== undefined) {
    tempFramebuffer.dispose();
  }
}
