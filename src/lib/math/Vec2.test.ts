import { makeVec2Fill, makeVec2Fit } from './Vec2.Functions.js';
import { Vec2 } from './Vec2.js';

describe('Vec2', () => {
  test('constructor defaults', () => {
    const a = new Vec2();
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
  });

  test('constructor values', () => {
    const b = new Vec2(1, 2);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
  });

  test('clone', () => {
    const b = new Vec2(1, 2);
    const c = b.clone();
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
  });

  test('copy', () => {
    const b = new Vec2(1, 2);
    const d = new Vec2().copy(b);
    expect(d.x).toBe(1);
    expect(d.y).toBe(2);
  });
});

describe('makeVec2Fit', () => {
  test('height fit', () => {
    const target = new Vec2(20, 40);
    const frame = new Vec2(10, 10);

    const fit = makeVec2Fit(frame, target);

    expect(fit.x).toBe(5);
    expect(fit.y).toBe(10);
  });

  test('width fit', () => {
    const target = new Vec2(40, 20);
    const frame = new Vec2(10, 10);

    const fit = makeVec2Fit(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(5);
  });

  test('zoom fit', () => {
    const target = new Vec2(5, 4);
    const frame = new Vec2(10, 10);

    const fit = makeVec2Fit(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(8);
  });

  test('fit', () => {
    const target = new Vec2(100, 100);
    const frame = new Vec2(10, 10);

    const fit = makeVec2Fit(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(10);
  });
});

describe('makeVec2Fill', () => {
  test('width fill', () => {
    const target = new Vec2(20, 40);
    const frame = new Vec2(10, 10);

    const fit = makeVec2Fill(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(20);
  });

  test('height fill', () => {
    const target = new Vec2(40, 20);
    const frame = new Vec2(10, 10);

    const fit = makeVec2Fill(frame, target);

    expect(fit.x).toBe(20);
    expect(fit.y).toBe(10);
  });

  test('zoom fit', () => {
    const target = new Vec2(6, 5);
    const frame = new Vec2(10, 10);

    const fit = makeVec2Fill(frame, target);

    expect(fit.x).toBe(12);
    expect(fit.y).toBe(10);
  });

  test('fit', () => {
    const target = new Vec2(100, 100);
    const frame = new Vec2(10, 10);

    const fit = makeVec2Fill(frame, target);

    expect(fit.x).toBe(10);
    expect(fit.y).toBe(10);
  });
});
