## Learning From Babylon.

- Engine is responsible for handling resize events
- It runs the render loop.
- The engine takes the canvas.

```javascript
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
//....
engine.runRenderLoop(function () {
  scene.render();
});
// the canvas/window resize event handler
window.addEventListener("resize", function () {
  engine.resize();
});
```

## Learning from PlayCanvas

```javascript
const app = new pc.Application(canvas);

// fill the available space at full resolution
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// ensure canvas is resized when window changes size
window.addEventListener("resize", () => app.resizeCanvas());
```

- PlayCanvas has a render loop that takes a deltaTime since the last render. :)

```javascript
// rotate the box according to the delta time since the last frame
app.on("update", (dt) => box.rotate(10 * dt, 20 * dt, 30 * dt));
```

## Findings

- Both babylon and playcanvas have a "resize" function that appears to resize the framebuffer to the size of the canvas.
- This should be added to canvasFramebuffer now.
