export function assert(
  condition: true | false,
  message = 'assertion failure'
): condition is true {
  if (!condition) {
    throw new Error(message);
  }
  return condition;
}
