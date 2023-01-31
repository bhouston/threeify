import { CubeMapTexture } from '@threeify/core';
import { Color3, color3MultiplyByScalar, Vec3 } from '@threeify/vector-math';

import { DirectionalLight } from '../scene/lights/DirectionalLight';
import { DomeLight } from '../scene/lights/DomeLight';
import { Light } from '../scene/lights/Light';
import { LightType } from '../scene/lights/LightType';
import { PointLight } from '../scene/lights/PointLight';
import { SpotLight } from '../scene/lights/SpotLight';
import { SceneNode } from '../scene/SceneNode';
import { depthFirstVisitor } from '../scene/Visitors';

export class PunctualLightUniforms {
  domeCubeMap?: CubeMapTexture;
  domeIntensity = new Color3(1, 1, 1);

  numLights = 0;
  lightTypes: number[] = [];
  lightPositions: Vec3[] = [];
  lightIntensity: Color3[] = [];
  lightDirections: Vec3[] = [];
  lightRanges: number[] = [];
  lightInnerConeCos: number[] = [];
  lightOuterConeCos: number[] = [];
}

export function punctualLightsTranslator(
  rootNode: SceneNode
): PunctualLightUniforms {
  // create a list of uniforms for them.
  const result = new PunctualLightUniforms();

  depthFirstVisitor(rootNode, (node: SceneNode) => {
    if (!(node instanceof Light)) {
      return;
    }
    const light = node as Light;

    if (light instanceof DomeLight) {
      result.domeCubeMap = light.cubeMap;
      result.domeIntensity = color3MultiplyByScalar(
        light.color,
        light.intensity
      );
    } else {
      result.numLights++;
      result.lightPositions.push(light.translation);
      result.lightIntensity.push(
        color3MultiplyByScalar(light.color, light.intensity)
      );

      if (node instanceof PointLight) {
        result.lightTypes.push(LightType.Point);
        result.lightDirections.push(new Vec3());
        result.lightRanges.push(node.range);
        result.lightInnerConeCos.push(0);
        result.lightOuterConeCos.push(0);
      } else if (node instanceof SpotLight) {
        result.lightTypes.push(LightType.Spot);
        result.lightDirections.push(node.direction);
        result.lightRanges.push(node.range);
        result.lightInnerConeCos.push(Math.cos(node.innerConeAngle));
        result.lightOuterConeCos.push(Math.cos(node.outerConeAngle));
      } else if (node instanceof DirectionalLight) {
        result.lightTypes.push(LightType.Directional);
        result.lightDirections.push(node.direction);
        result.lightRanges.push(0);
        result.lightInnerConeCos.push(0);
        result.lightOuterConeCos.push(0);
      }
    }
  });

  return result;
}
