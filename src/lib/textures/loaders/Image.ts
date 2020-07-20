//
// promise-based image loader based on https://jsfiddle.net/fracz/kf8c6t1v/
//
// Authors:
// * @bhouston
//

export function fetchImage(url: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => {
      reject(new Error(`failed to load image: ${url}`));
    });
    image.src = url;
  });
}

export async function fetchCubeImages(urlPattern: string): Promise<HTMLImageElement[]> {
  const cubeMapFaces = ["px", "nx", "py", "ny", "pz", "nz"];
  const fetchPromises: Promise<HTMLImageElement>[] = [];
  cubeMapFaces.forEach((face) => {
    fetchPromises.push(fetchImage(urlPattern.replace("*", face)));
  });
  return Promise.all(fetchPromises);
}
