//
// promise-based image loader based on https://jsfiddle.net/fracz/kf8c6t1v/
//
// Authors:
// * @bhouston
//

export function fetchImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => {
      reject(new Error(`failed to load image: ${url}`));
    });
    image.src = url;
  });
}

export function fetchImageBitmap(url: string): Promise<ImageBitmap> {
  return new Promise<ImageBitmap>((resolve, reject) => {
    fetch(url)
      .then((response: Response) => {
        if (response.status === 200) {
          return response.blob();
        }
        reject(`Unable to load resource with url ${url}`);
      })

      // Turn it into an ImageBitmap.
      .then((blobData: Blob | undefined) => {
        if (blobData !== undefined) {
          return createImageBitmap(blobData);
        }
      })

      // Post it back to main thread.
      .then(
        (imageBitmap) => {
          return resolve(imageBitmap);
        },
        (err) => {
          reject(err);
        },
      );
  });
}

export function isImageBitmapSupported(): boolean {
  return "createImageBitmap" in window;
}

export type Image = HTMLImageElement | ImageBitmap;

export function fetchImage(url: string): Promise<Image> {
  if (isImageBitmapSupported()) {
    return fetchImageBitmap(url);
  }
  return fetchImageElement(url);
}

export async function fetchCubeImages(urlPattern: string): Promise<Image[]> {
  const cubeMapFaces = ["px", "nx", "py", "ny", "pz", "nz"];
  const fetchPromises: Promise<Image>[] = [];
  cubeMapFaces.forEach((face) => {
    fetchPromises.push(fetchImage(urlPattern.replace("*", face)));
  });
  return Promise.all(fetchPromises);
}
