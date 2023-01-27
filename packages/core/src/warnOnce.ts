const warned: { [message: string]: boolean } = {};

export function logOnce(message: string): void {
  if (!warned[message]) {
    warned[message] = true;
    console.log(message);
  }
}

export function warnOnce(message: string): void {
  if (!warned[message]) {
    warned[message] = true;
    console.warn(message);
  }
}
