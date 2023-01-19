export function isMacOS(): boolean {
  // source: https://stackoverflow.com/questions/10527983/best-way-to-detect-mac-os-x-or-windows-computers-with-javascript-or-jquery
  return /(Mac)/i.test(navigator.platform);
}
export function isiOS(): boolean {
  // source: https://stackoverflow.com/questions/10527983/best-way-to-detect-mac-os-x-or-windows-computers-with-javascript-or-jquery
  return /(iPhone|iPod|iPad)/i.test(navigator.platform);
}
export function isFirefox(): boolean {
  return /(Gecko\/)/i.test(navigator.userAgent);
}
