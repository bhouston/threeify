const warned: { [message: string]: boolean } = {};

export function warnOnce(message: string): void {
  if (!warned[message]) {
    warned[message] = true;
    console.warn(message);
  }
}
