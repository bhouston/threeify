import { Mat4 } from '@threeify/math';

import { assert } from '../../../core/assert';
import { icosahedronGeometry } from '../../../geometry/primitives/polyhedronGeometry';
import { ShaderMaterial } from '../../../materials/ShaderMaterial';
import { geometryToBufferGeometry } from '../../webgl/buffers/BufferGeometry';
import { CullingState } from '../../webgl/CullingState';
import { DepthTestState } from '../../webgl/DepthTestState';
import {
  renderBufferGeometry,
  VirtualFramebuffer
} from '../../webgl/framebuffers/VirtualFramebuffer';
import { shaderMaterialToProgram } from '../../webgl/programs/Program';
import { RenderingContext } from '../../webgl/RenderingContext';
import { TexImage2D } from '../../webgl/textures/TexImage2D';
import { IEffect } from '../IEffect';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

export interface ICubemapBackgroundProps {
  cubeMapTexImage2D: TexImage2D;
  cubeMapIntensity: number;
  localToWorld: Mat4;
  worldToView: Mat4;
  viewToClip: Mat4;
  depth: number;
  toneMapping: boolean;
  exposure: number;
  sRGB: boolean;
  targetFramebuffer: VirtualFramebuffer;
}

export interface CubemapBackground extends IEffect {
  exec(props: ICubemapBackgroundProps): void;
}

export async function createCubemapBackground(
  context: RenderingContext
): Promise<CubemapBackground> {
  const programRef = context.programCache.acquireRef(
    'cubemapBackground',
    (name) => {
      const material = new ShaderMaterial(name, vertexSource, fragmentSource);
      return shaderMaterialToProgram(context, material);
    }
  );
  const program = await programRef.promise;

  const geometry = icosahedronGeometry(1, 5, true);
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  return {
    exec: (props: ICubemapBackgroundProps) => {
      const {
        cubeMapTexImage2D,
        cubeMapIntensity,
        targetFramebuffer,
        localToWorld,
        worldToView,
        viewToClip,
        depth,
        toneMapping,
        exposure,
        sRGB
      } = props;

      assert(cubeMapIntensity > 0);

      const uniforms = {
        cubeMap: cubeMapTexImage2D,
        cubeMapIntensity,
        localToWorld,
        worldToView,
        depth,
        viewToClip,
        exposure,
        toneMapping,
        sRGB
      };

      renderBufferGeometry({
        framebuffer: targetFramebuffer,
        bufferGeometry,
        program,
        uniforms,
        depthTestState: DepthTestState.None,
        cullingState: CullingState.Front
      });
    },
    dispose: () => {
      programRef.dispose();
    }
  };
}
