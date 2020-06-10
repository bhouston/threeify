import { MaterialOutputFlags } from "../../../../../materials/MaterialOutputFlags";

function createEnumDefines(): string {
  let output = [];
  for (let name in Object.keys(MaterialOutputFlags)) {
    output.push(`#define MATERIAL_OUTPUTS ${MaterialOutputFlags[name]}`);
  }
  return output.join("\n");
}

export default createEnumDefines();
