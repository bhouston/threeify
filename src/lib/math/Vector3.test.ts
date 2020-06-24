import { Vector3 } from "./Vector3";

test("Instancing", () => {
  const a = new Vector3();
  expect(a.x).toBe(0);
  expect(a.y).toBe(0);
  expect(a.z).toBe(0);

  const b = new Vector3(1, 2, 3);
  expect(b.x).toBe(1);
  expect(b.y).toBe(2);
  expect(b.z).toBe(3);
});

test("Instancing", () => {
  const a = new Vector3();
  expect(a.r).toBe(0);
  expect(a.g).toBe(0);
  expect(a.b).toBe(0);

  const b = new Vector3(1, 2, 3);
  expect(b.r).toBe(1);
  expect(b.g).toBe(2);
  expect(b.b).toBe(3);
});
