import { Vector2 } from "./Vector2";

test("Instancing", () => {
  const a = new Vector2();
  expect(a.x).toBe(0);
  expect(a.y).toBe(0);

  const b = new Vector2(1, 2);
  expect(b.x).toBe(1);
  expect(b.y).toBe(2);

  const c = b.clone();
  expect(c.x).toBe(1);
  expect(c.y).toBe(2);

  const d = new Vector2().copy(b);
  expect(d.x).toBe(1);
  expect(d.y).toBe(2);
});
