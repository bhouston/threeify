import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";
import { ClearState } from "../../../lib/renderers/webgl/ClearState";
import { BufferBit } from "../../../lib/renderers/webgl/framebuffers/BufferBit";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Layer } from "./layers/Layer";
import { LayerRenderer } from "./layers/LayerRenderer";

async function init(): Promise<null> {
  const layerRenderer = new LayerRenderer(document.getElementById("framebuffer") as HTMLCanvasElement);

  layerRenderer.layerMaxSize = new Vector2(2048, 2048);

  const url = "/assets/textures/decals/splat.png";
  const image = await fetchImage(url);
  const texImage2D = await layerRenderer.loadTexImage2D(url, image);
  const whiteClearState = new ClearState(new Vector3(1, 1, 1), 1.0);

  function animate(): void {
    requestAnimationFrame(animate);

    const layers: Layer[] = [];
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(0, 0)));
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(100, 0)));
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(0, 100)));
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(100, 100)));
    layers.push(new Layer(layerRenderer, url, texImage2D, new Vector2(200, 200)));

    // const now = Date.now();
    // layerRenderer.zoomScale = Math.sin(now * 0.0001) + 2.0;
    // layerRenderer.panPosition = new Vector2(Math.cos(now * 0.0003), Math.sin(now * 0.0002));

    layerRenderer.layers = layers;
    layerRenderer.context.canvasFramebuffer.clear(BufferBit.All, whiteClearState);
    layerRenderer.render(layerRenderer.context.canvasFramebuffer);
    console.log("drawing splats");
  }

  animate();

  return null;
}

init();
