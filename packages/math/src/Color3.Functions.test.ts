import { color3Add, color3Equals, hexToColor3 } from './Color3.Functions';
import { Color3 } from './Color3';

describe('Color Functions', () => {
  test('color3Equals', () => {
    const a = new Color3(1, 2, 3);
    const b = new Color3(1, 2, 3);
    const c = new Color3(1, 2, 4);
    expect(color3Equals(a, b)).toBe(true);
    expect(color3Equals(a, c)).toBe(false);
  });

  test('color3Add', () => {
    const a = new Color3(1, 2, 3);
    const b = new Color3(1, 2, 3);
    const c = new Color3(2, 4, 6);
    expect(color3Equals(color3Add(a, b), c)).toBe(true);
  });

  test('hexToColor3', () => {
    // test conversion from hex to color3
    const hexColor = 0x00ff00;
    const color = hexToColor3(hexColor);
    expect(color.r).toBe(0);
    expect(color.g).toBe(1);
    expect(color.b).toBe(0);
  });
});
