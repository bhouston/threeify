//
// promise-based image loader based on https://jsfiddle.net/fracz/kf8c6t1v/
//
// Authors:
// * @bhouston
//

export function fetchImage(url: string) : Promise<HTMLImageElement> {

    return new Promise<HTMLImageElement>((resolve, reject) => {

        let image = new Image();

        image.addEventListener('load', e => resolve(image));
        image.addEventListener('error', () => {
            reject(new Error(`Failed to load image's URL: ${url}`));
        });

        image.src = url;

    });
}