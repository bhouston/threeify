import { Vector2 } from "./Vector2";

test("Instancing", () => {
  const a = new Vector2();
  expect(a.x).toBe(0);
  expect(a.y).toBe(0);

  const b = new Vector2(1, 2);
  expect(b.x).toBe(1);
  expect(b.y).toBe(2);
});
