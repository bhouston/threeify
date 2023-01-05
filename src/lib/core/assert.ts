export function assertTrue(
  condition: true | false,
  message = 'assertTrue failure'
): condition is true {
  if (!condition) {
    throw new Error(message);
  }
  return condition;
}
