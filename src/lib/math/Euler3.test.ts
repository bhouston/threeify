import { Euler, EulerOrder } from "./Euler3";

test("Instancing", () => {
  const a = new Euler();
  expect(a.x).toBe(0);
  expect(a.y).toBe(0);
  expect(a.z).toBe(0);
  expect(a.order).toBe(EulerOrder.Default);

  const b = new Euler(1, 2, 3, EulerOrder.ZXY);
  expect(b.x).toBe(1);
  expect(b.y).toBe(2);
  expect(b.z).toBe(3);
  expect(b.order).toBe(EulerOrder.ZXY);
});
