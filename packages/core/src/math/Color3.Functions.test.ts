import { Color3 } from './Color3';
import {
  color3Add,
  color3Dot,
  color3Equals,
  color3Lerp,
  color3MultiplyByScalar,
  color3Negate,
  color3Subtract
} from './Color3.Functions';

const red = new Color3(1, 0, 0);
const blue = new Color3(0, 0, 1);

describe('Color3 Functions', () => {
  test('color3Equals', () => {
    expect(color3Equals(red, red)).toBe(true);
    expect(color3Equals(red, blue)).toBe(false);
  });

  test('color3Add', () => {
    const result = color3Add(red, blue);
    expect(result).toEqual(new Color3(1, 0, 1));
  });

  test('color3Subtract', () => {
    const result = color3Subtract(red, blue);
    expect(result).toEqual(new Color3(1, 0, -1));
  });

  test('color3MultiplyByScalar', () => {
    const result = color3MultiplyByScalar(red, 2);
    expect(result).toEqual(new Color3(2, 0, 0));
  });

  test('color3Negate', () => {
    const result = color3Negate(red);
    expect(result.r).toBeCloseTo(-1);
    expect(result.g).toBeCloseTo(0);
    expect(result.b).toBeCloseTo(0);
  });

  test('color3Dot', () => {
    const result = color3Dot(red, blue);
    expect(result).toBeCloseTo(0);
  });

  test('color3Lerp', () => {
    const result = color3Lerp(red, blue, 0.5);
    expect(result).toEqual(new Color3(0.5, 0, 0.5));
  });
});
