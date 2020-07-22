import { FragmentOutput } from "../../../materials/MaterialOutputs";

function createEnumDefines(): string {
  const output = [];
  for (const name in Object.keys(FragmentOutput)) {
    output.push(`#define FRAGMENT_OUTPUT ${FragmentOutput[name]}`);
  }
  return output.join("\n");
}

export default createEnumDefines();
