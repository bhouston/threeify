import { Layer } from "../../../lib/engines/layerCompositor/Layer";
import { LayerCompositor } from "../../../lib/engines/layerCompositor/LayerCompositor";
import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";

const canvas = document.getElementById("framebuffer") as HTMLCanvasElement;

async function init(): Promise<null> {
  const layerCompositor = new LayerCompositor(canvas);

  layerCompositor.imageSize = new Vector2(2048, 2048);

  const splatUrl = "/assets/textures/decals/splat.png";
  const splatTexImage2D = await layerCompositor.loadTexImage2D(splatUrl);

  const shirtUrl = "/assets/textures/test/moireShirt.png";
  const shirtTexImage2D = await layerCompositor.loadTexImage2D(shirtUrl);

  const radialUrl = "/assets/textures/test/moireRadial.png";
  const radialTexImage2D = await layerCompositor.loadTexImage2D(radialUrl);

  const concentricUrl = "/assets/textures/test/moireConcentric.png";
  const concentricTexImage2D = await layerCompositor.loadTexImage2D(concentricUrl);

  layerCompositor.clearState.color = new Vector3(0.2, 0.2, 0.2);

  function animate(): void {
    const layers: Layer[] = [];
    layers.push(new Layer(layerCompositor, shirtUrl, shirtTexImage2D, new Vector2(0, 0), undefined, undefined, true));
    layers.push(
      new Layer(layerCompositor, splatUrl, splatTexImage2D, new Vector2(250, 250), undefined, undefined, true),
    );
    layers.push(
      new Layer(layerCompositor, shirtUrl, shirtTexImage2D, new Vector2(600, 600), undefined, undefined, true),
    );
    layers.push(
      new Layer(layerCompositor, splatUrl, splatTexImage2D, new Vector2(750, 1000), undefined, undefined, true),
    );
    // layers.push(new Layer(layerCompositor, radialUrl, radialTexImage2D, new Vector2(825, 0)));
    // layers.push(new Layer(layerCompositor, concentricUrl, concentricTexImage2D, new Vector2(0, 200)));
    // layers.push(new Layer(layerCompositor, radialUrl, radialTexImage2D, new Vector2(825, 400)));

    // const now = Date.now();
    // layerRenderer.zoomScale = Math.sin(now * 0.0001) + 2.0;
    // layerRenderer.panPosition = new Vector2(Math.cos(now * 0.0003), Math.sin(now * 0.0002));

    layerCompositor.layers = layers;
    layerCompositor.render();
    // console.log("drawing splats");
  }

  animate();

  const zoomFactor = 2.5;

  window.addEventListener("resize", () => {
    layerCompositor.context.canvasFramebuffer.resize();
    requestAnimationFrame(animate);
  });
  canvas.addEventListener("mousedown", (mouseEvent: MouseEvent) => {
    if (mouseEvent.button === 0) {
      layerCompositor.zoomScale = zoomFactor;
      layerCompositor.panPosition = new Vector2(-mouseEvent.offsetX, -mouseEvent.offsetY);
      requestAnimationFrame(animate);
    }
  });
  canvas.addEventListener("mouseup", (mouseEvent: MouseEvent) => {
    if (mouseEvent.button === 0) {
      layerCompositor.zoomScale = 1.0;
      layerCompositor.panPosition = new Vector2(0, 0);
      requestAnimationFrame(animate);
    }
  });
  canvas.addEventListener("mousemove", (mouseEvent: MouseEvent) => {
    if (layerCompositor.zoomScale > 1) {
      // console.log(`mouse offset ${mouseEvent.offsetX}, ${mouseEvent.offsetY}`);
      layerCompositor.panPosition = new Vector2(-mouseEvent.offsetX, -mouseEvent.offsetY);
      // console.log(layerRenderer.panPosition);
      requestAnimationFrame(animate);
    }
  });
  canvas.addEventListener("touchstart", (touchEvent: TouchEvent) => {
    layerCompositor.zoomScale = zoomFactor;
    layerCompositor.panPosition = new Vector2(-touchEvent.touches[0].clientX, -touchEvent.touches[0].clientY);
    requestAnimationFrame(animate);
  });
  canvas.addEventListener("touchend", () => {
    layerCompositor.zoomScale = 1.0;
    layerCompositor.panPosition = new Vector2(0, 0);
    requestAnimationFrame(animate);
  });
  canvas.addEventListener("touchmove", (touchEvent: TouchEvent) => {
    layerCompositor.panPosition = new Vector2(-touchEvent.touches[0].clientX, -touchEvent.touches[0].clientY);
    requestAnimationFrame(animate);
  });

  return null;
}

init();
