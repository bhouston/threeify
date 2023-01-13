import { color3MultiplyByScalar } from '../math/Color3.Functions.js';
import { Color3 } from '../math/Color3.js';
import { Vec3 } from '../math/Vec3.js';
import { DirectionalLight } from '../nodes/lights/DirectionalLight.js';
import { Light } from '../nodes/lights/Light.js';
import { LightType } from '../nodes/lights/LightType.js';
import { PointLight } from '../nodes/lights/PointLight.js';
import { SpotLight } from '../nodes/lights/SpotLight.js';
import { Node } from '../nodes/Node.js';
import { depthFirstVisitor } from '../nodes/Visitors.js';

export class PunctualLightUniforms {
  numLights = 0;
  lightTypes: number[] = [];
  lightPositions: Vec3[] = [];
  lightColors: Color3[] = [];
  lightDirections: Vec3[] = [];
  lightRanges: number[] = [];
  lightInnerConeCos: number[] = [];
  lightOuterConeCos: number[] = [];
}

export function punctualLightsTranslator(
  rootNode: Node
): PunctualLightUniforms {
  // create a list of uniforms for them.
  const result = new PunctualLightUniforms();

  depthFirstVisitor(rootNode, (node: Node) => {
    if (!(node instanceof Light)) {
      return;
    }
    const light = node as Light;
    result.numLights++;
    result.lightPositions.push(light.position);
    result.lightColors.push(
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
  });

  return result;
}
