import {
  BlendState,
  BufferGeometry,
  CullingState,
  DepthTestState,
  geometryToBufferGeometry,
  shaderMaterialToProgram,
  passGeometry,
  Program,
  renderBufferGeometry,
  ShaderMaterial,
  TexImage2D,
  VirtualFramebuffer
} from '@threeify/core';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

let program: Program | undefined;
let bufferGeometry: BufferGeometry | undefined;

export interface ICombinePassProps {
  opaqueTexImage2D: TexImage2D;
  transmissionTexImage2D: TexImage2D;
  targetFramebuffer: VirtualFramebuffer;
  exposure: number;
}

export async function combinePass(props: ICombinePassProps): Promise<void> {
  const {
    opaqueTexImage2D,
    transmissionTexImage2D,
    targetFramebuffer,
    exposure
  } = props;
  const { context } = opaqueTexImage2D;

  // TODO: cache geometry + bufferGeometry.
  if (bufferGeometry === undefined) {
    const geometry = passGeometry();
    bufferGeometry = geometryToBufferGeometry(context, geometry);
  }

  // TODO: cache material + program.
  if (program === undefined) {
    const material = new ShaderMaterial(
      'combinePass',
      vertexSource,
      fragmentSource
    );
    program = await shaderMaterialToProgram(context, material);
  }

  const uniforms = {
    opaqueTexture: opaqueTexImage2D,
    transmissionTexture: transmissionTexImage2D,
    exposure: exposure || 1
  };

  renderBufferGeometry({
    framebuffer: targetFramebuffer,
    program: program,
    uniforms,
    bufferGeometry: bufferGeometry,
    depthTestState: DepthTestState.None,
    blendState: BlendState.None,
    cullingState: CullingState.None
  });
}
