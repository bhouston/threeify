import { OutputChannels } from '../../../materials/OutputChannels';

function createEnumDefines(): string {
  const output = [];
  for (const name in Object.keys(OutputChannels)) {
    output.push(`#define FRAGMENT_OUTPUT ${OutputChannels[name]}`);
  }
  return output.join('\n');
}

export default createEnumDefines();
