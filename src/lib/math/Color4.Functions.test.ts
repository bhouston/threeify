import { Color4 } from './Color4';
import {
  color4Add,
  color4Dot,
  color4Equals,
  color4Lerp,
  color4MultiplyByScalar,
  color4Negate,
  color4Subtract
} from './Color4.Functions';

const red = new Color4(1, 0, 0, 1);
const blue = new Color4(0, 0, 1, 1);

describe('Color4 Functions', () => {
  test('color4Equals', () => {
    expect(color4Equals(red, red)).toBe(true);
    expect(color4Equals(red, blue)).toBe(false);
  });

  test('color4Add', () => {
    const result = color4Add(red, blue);
    expect(result).toEqual(new Color4(1, 0, 1, 2));
  });

  test('color4Subtract', () => {
    const result = color4Subtract(red, blue);
    expect(result).toEqual(new Color4(1, 0, -1, 0));
  });

  test('color4MultiplyByScalar', () => {
    const result = color4MultiplyByScalar(red, 2);
    expect(result).toEqual(new Color4(2, 0, 0, 2));
  });

  test('color4Negate', () => {
    const result = color4Negate(red);
    expect(result.r).toBeCloseTo(-1);
    expect(result.g).toBeCloseTo(0);
    expect(result.b).toBeCloseTo(0);
    expect(result.a).toBeCloseTo(-1);
  });

  test('color4Dot', () => {
    const result = color4Dot(red, blue);
    expect(result).toEqual(1);
  });

  test('color4Lerp', () => {
    const result = color4Lerp(red, blue, 0.5);
    expect(result).toEqual(new Color4(0.5, 0, 0.5, 1));
  });
});
