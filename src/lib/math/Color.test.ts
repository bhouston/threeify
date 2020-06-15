import { Color } from "./Color";

test("Instancing", () => {
  const a = new Color();
  expect(a.r).toBe(0);
  expect(a.g).toBe(0);
  expect(a.b).toBe(0);

  const b = new Color(1, 2, 3);
  expect(b.r).toBe(1);
  expect(b.g).toBe(2);
  expect(b.b).toBe(3);
});
