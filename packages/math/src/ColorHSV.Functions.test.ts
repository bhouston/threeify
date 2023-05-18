import { Color3 } from './Color3';
import { ColorHSV } from './ColorHSV';
import { color3ToHsv, hsvToColor3 } from './ColorHSV.Functions';

describe('ColorHSV Functions', () => {
  test('hsvToColor3/color3ToHSV', () => {
    // this pair set manually validated via: https://www.rapidtables.com/convert/color/hsv-to-rgb.html
    const pairs = [
      { hsv: new ColorHSV(0, 1, 0.5), color: new Color3(0.5, 0, 0) },
      {
        hsv: new ColorHSV(1 / 6, 1, 0.5),
        color: new Color3(0.5, 0.5, 0)
      },
      {
        hsv: new ColorHSV(1 / 3, 1, 0.5),
        color: new Color3(0, 0.5, 0)
      },
      { hsv: new ColorHSV(1 / 2, 1, 0.5), color: new Color3(0, 0.5, 0.5) },
      {
        hsv: new ColorHSV(2 / 3, 1, 0.5),
        color: new Color3(0, 0, 0.5)
      },
      {
        hsv: new ColorHSV(5 / 6, 1, 0.5),
        color: new Color3(0.5, 0, 0.5)
      },
      { hsv: new ColorHSV(0, 0, 0.5), color: new Color3(0.5, 0.5, 0.5) },
      { hsv: new ColorHSV(0, 0, 0), color: new Color3(0, 0, 0) },
      { hsv: new ColorHSV(0, 1, 1), color: new Color3(1, 0, 0) },
      { hsv: new ColorHSV(0, 0, 1), color: new Color3(1, 1, 1) }
    ];
    for (const pair of pairs) {
      const { hsv, color } = pair;
      console.log(hsv, color);
      const color2 = hsvToColor3(hsv);
      expect(color2.r).toBeCloseTo(color.r);
      expect(color2.g).toBeCloseTo(color.g);
      expect(color2.b).toBeCloseTo(color.b);

      const hsl2 = color3ToHsv(color2);
      expect(hsl2.h).toBeCloseTo(hsv.h);
      expect(hsl2.s).toBeCloseTo(hsv.s);
      expect(hsl2.v).toBeCloseTo(hsv.v);
    }
  });
});
