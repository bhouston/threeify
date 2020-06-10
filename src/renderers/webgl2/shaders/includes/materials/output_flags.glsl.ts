import { MaterialOutputs } from "../../../../../materials/MaterialOutputs";

function createEnumDefines(): string {
  let output = [];
  for (let name in Object.keys(MaterialOutputs)) {
    output.push(`#define MATERIAL_OUTPUTS ${MaterialOutputs[name]}`);
  }
  return output.join("\n");
}

export default createEnumDefines();
