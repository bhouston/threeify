import { Quaternion } from "./Quaternion";

test("Instancing", () => {
  const a = new Quaternion();
  expect(a.x).toBe(0);
  expect(a.y).toBe(0);
  expect(a.z).toBe(0);
  expect(a.w).toBe(1);

  const b = new Quaternion(1, 2, 3, 4);
  expect(b.x).toBe(1);
  expect(b.y).toBe(2);
  expect(b.z).toBe(3);
  expect(b.w).toBe(4);
});
