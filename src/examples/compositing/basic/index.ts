import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Layer } from "./layers/Layer";
import { LayerRenderer } from "./layers/LayerRenderer";

const canvas = document.getElementById("framebuffer") as HTMLCanvasElement;

async function init(): Promise<null> {
  const layerRenderer = new LayerRenderer(canvas);

  layerRenderer.layerMaxSize = new Vector2(2048, 2048);

  const url = "/assets/textures/decals/splat.png";
  const image = await fetchImage(url);
  const texImage2D = await layerRenderer.loadTexImage2D(url, image);

  layerRenderer.backgroundColor = new Vector3(0.2, 0.2, 0.2);

  function animate(): void {
    requestAnimationFrame(animate);

    const layers: Layer[] = [];
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(750, 1500)));
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(1000, 0)));
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(500, 1000)));
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(1250, 500)));
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(200, 200)));

    // const now = Date.now();
    // layerRenderer.zoomScale = Math.sin(now * 0.0001) + 2.0;
    // layerRenderer.panPosition = new Vector2(Math.cos(now * 0.0003), Math.sin(now * 0.0002));

    layerRenderer.layers = layers;
    layerRenderer.render(layerRenderer.context.canvasFramebuffer);
    // console.log("drawing splats");
  }

  animate();

  window.addEventListener("resize", () => {
    layerRenderer.context.canvasFramebuffer.resize();
    layerRenderer.updateSize(layerRenderer.context.canvasFramebuffer);
  });
  canvas.addEventListener("mousedown", (mouseEvent: MouseEvent) => {
    if (mouseEvent.button === 0) {
      layerRenderer.zoomScale = 2.0;
    }
  });
  canvas.addEventListener("mouseup", (mouseEvent: MouseEvent) => {
    if (mouseEvent.button === 0) {
      layerRenderer.zoomScale = 1.0;
      layerRenderer.panPosition = new Vector2(0, 0);
    }
  });
  canvas.addEventListener("mousemove", (mouseEvent: MouseEvent) => {
    if (layerRenderer.zoomScale > 1) {
      console.log(`mouse offset ${mouseEvent.offsetX}, ${mouseEvent.offsetY}`);
      layerRenderer.panPosition = new Vector2(
        canvas.width * 0.5 - mouseEvent.offsetX,
        canvas.height * 0.5 - mouseEvent.offsetY,
      );
      console.log(layerRenderer.panPosition);
    }
  });

  return null;
}

init();
