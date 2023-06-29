import { Color3 } from './Color3.js';
import { ColorHSL } from './ColorHSL.js';
import { color3ToHsl, hslToColor3 } from './ColorHSL.Functions.js';

describe('ColorHSL Functions', () => {
  test('hslToColor3/color3ToHsl', () => {
    const pairs = [
      { hsl: new ColorHSL(0, 1, 0.5), color: new Color3(1, 0, 0) },
      { hsl: new ColorHSL(1 / 6, 1, 0.5), color: new Color3(1, 1, 0) },
      { hsl: new ColorHSL(2 / 6, 1, 0.5), color: new Color3(0, 1, 0) },
      { hsl: new ColorHSL(3 / 6, 1, 0.5), color: new Color3(0, 1, 1) },
      { hsl: new ColorHSL(4 / 6, 1, 0.5), color: new Color3(0, 0, 1) },
      { hsl: new ColorHSL(5 / 6, 1, 0.5), color: new Color3(1, 0, 1) }
    ];

    for (const pair of pairs) {
      const { hsl, color } = pair;
      const color2 = hslToColor3(hsl);
      expect(color2.r).toBeCloseTo(color.r);
      expect(color2.g).toBeCloseTo(color.g);
      expect(color2.b).toBeCloseTo(color.b);

      const hsl2 = color3ToHsl(color2);
      expect(hsl2.h).toBeCloseTo(hsl.h);
      expect(hsl2.s).toBeCloseTo(hsl.s);
      expect(hsl2.l).toBeCloseTo(hsl.l);
    }
  });
});
