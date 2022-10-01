import { Vector2 } from './Vector2';
import { makeVector2Fill, makeVector2Fit } from './Vector2.Functions';

describe('Vector2', () => {
  test('constructor defaults', () => {
    const a = new Vector2();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
  });

  test('constructor values', () => {
    const b = new Vector2(1, 2);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
  });

  test('clone', () => {
    const b = new Vector2(1, 2);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
  });

  test('copy', () => {
    const b = new Vector2(1, 2);
    const d = new Vector2().copy(b);
    expect(d.x).toBe(1);
    expect(d.y).toBe(2);
  });
});

describe('makeVector2Fit', () => {
  test('height fit', () => {
    const target = new Vector2(20, 40);
    const frame = new Vector2(10, 10);

    const fit = makeVector2Fit(frame, target);

    expect(fit.x).toBe(5);
    expect(fit.y).toBe(10);
  });

  test('width fit', () => {
    const target = new Vector2(40, 20);
    const frame = new Vector2(10, 10);

    const fit = makeVector2Fit(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(5);
  });

  test('zoom fit', () => {
    const target = new Vector2(5, 4);
    const frame = new Vector2(10, 10);

    const fit = makeVector2Fit(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(8);
  });

  test('fit', () => {
    const target = new Vector2(100, 100);
    const frame = new Vector2(10, 10);

    const fit = makeVector2Fit(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(10);
  });
});

describe('makeVector2Fill', () => {
  test('width fill', () => {
    const target = new Vector2(20, 40);
    const frame = new Vector2(10, 10);

    const fit = makeVector2Fill(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(20);
  });

  test('height fill', () => {
    const target = new Vector2(40, 20);
    const frame = new Vector2(10, 10);

    const fit = makeVector2Fill(frame, target);

    expect(fit.x).toBe(20);
    expect(fit.y).toBe(10);
  });

  test('zoom fit', () => {
    const target = new Vector2(6, 5);
    const frame = new Vector2(10, 10);

    const fit = makeVector2Fill(frame, target);

    expect(fit.x).toBe(12);
    expect(fit.y).toBe(10);
  });

  test('fit', () => {
    const target = new Vector2(100, 100);
    const frame = new Vector2(10, 10);

    const fit = makeVector2Fill(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(10);
  });
});
