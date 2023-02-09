//
// promise-based image loader based on https://jsfiddle.net/fracz/kf8c6t1v/
//
// Authors:
// * @bhouston
//

import { Vec2 } from '@threeify/math';

export function fetchImageElement(
  url: string,
  size = new Vec2()
): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    if (size.x > 0 || size.y > 0) {
      image.width = size.x;
      image.height = size.y;
    }
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', () => {
      reject(new Error(`failed to load image: ${url}`));
    });
    image.src = url;
  });
}

export function createImageBitmapFromArrayBuffer(
  arrayBufferView: ArrayBufferView,
  mimeType: string
): Promise<ImageBitmap> {
  const blob = new Blob([arrayBufferView], { type: mimeType });
  return createImageBitmap(blob);
}

export function fetchImageBitmap(url: string): Promise<ImageBitmap> {
  return new Promise<ImageBitmap>((resolve, reject) => {
    // eslint-disable-next-line promise/catch-or-return
    fetch(url)
      .then((response: Response) => {
        if (response.status === 200) {
          return response.blob();
        }
        reject(`Unable to load resource with url ${url}`);
        return undefined;
      })

      // Turn it into an ImageBitmap.
      .then((blobData: Blob | undefined) => {
        if (blobData !== undefined) {
          return createImageBitmap(blobData);
        }
        reject(`Unable to create image from blobData ${blobData}`);
        return undefined;
      })

      // Post it back to main thread.
      .then(
        (imageBitmap) => {
          if (imageBitmap === undefined) {
            throw new Error('imageBitmap is undfined!');
          }
          return resolve(imageBitmap);
        },
        (err) => {
          reject(err);
        }
      );
  });
}

export function isImageBitmapSupported(): boolean {
  return 'createImageBitmap' in window;
}

export type Image = HTMLImageElement | ImageBitmap;

export function fetchImage(url: string): Promise<Image> {
  if (isImageBitmapSupported() && !url.includes('.svg')) {
    return fetchImageBitmap(url);
  }
  return fetchImageElement(url);
}

export async function fetchCubeImages(urlPattern: string): Promise<Image[]> {
  const cubeMapFaces = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
  const fetchPromises: Promise<Image>[] = [];
  cubeMapFaces.forEach((face) => {
    fetchPromises.push(fetchImage(urlPattern.replace('*', face)));
  });
  return Promise.all(fetchPromises);
}
