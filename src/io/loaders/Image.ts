//
// promise-based image loader based on https://jsfiddle.net/fracz/kf8c6t1v/
//
// Authors:
// * @bhouston
//

export function fetchImage(url: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", (e) => resolve(image));
    image.addEventListener("error", () => {
      reject(new Error(`failed to load image: ${url}`));
    });

    image.src = url;
  });
}
