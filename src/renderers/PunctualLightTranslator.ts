import { Color } from "../math/Color";
import { Vector3 } from "../math/Vector3";
import { DirectionalLight } from "../nodes/lights/DirectionalLight";
import { Light } from "../nodes/lights/Light";
import { PointLight } from "../nodes/lights/PointLight";
import { SpotLight } from "../nodes/lights/SpotLight";
import { depthFirstVisitor, Node } from "../nodes/Node";

export class PunctualLightUniforms {
  numLights = 0;
  lightTypes: number[] = [];
  lightPositions: Vector3[] = [];
  lightColors: Color[] = [];
  lightDirections: Vector3[] = [];
  lightRanges: number[] = [];
  lightInnerConeCos: number[] = [];
  lightOuterConeCos: number[] = [];
}

export function punctualLightsTranslator(rootNode: Node): PunctualLightUniforms {
  // create a list of uniforms for them.
  const result = new PunctualLightUniforms();

  depthFirstVisitor(rootNode, (node: Node) => {
    if (!(node instanceof Light)) {
      return;
    }
    const light = node as Light;
    result.numLights++;
    result.lightTypes.push(light.type);
    result.lightPositions.push(light.position);
    result.lightColors.push(light.color.clone().multiplyByScalar(light.intensity));

    if (node instanceof PointLight) {
      const pointLight = node as PointLight;
      result.lightDirections.push(new Vector3());
      result.lightRanges.push(pointLight.range);
      result.lightInnerConeCos.push(0);
      result.lightOuterConeCos.push(0);
    } else if (node instanceof SpotLight) {
      const spotLight = node as SpotLight;
      result.lightDirections.push(spotLight.direction);
      result.lightRanges.push(spotLight.range);
      result.lightInnerConeCos.push(Math.cos(spotLight.innerConeAngle));
      result.lightOuterConeCos.push(Math.cos(spotLight.outerConeAngle));
    } else if (node instanceof DirectionalLight) {
      const directionalLight = node as DirectionalLight;
      result.lightDirections.push(directionalLight.direction);
      result.lightRanges.push(0);
      result.lightInnerConeCos.push(0);
      result.lightOuterConeCos.push(0);
    }
  });

  return result;
}
