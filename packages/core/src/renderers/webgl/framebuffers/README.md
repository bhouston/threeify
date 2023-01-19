## How Babylon resizes its canvas:

```javascript
/**
  * Resize the view according to the canvas' size
  */
public resize(): void {
    let width: number;
    let height: number;

    if (DomManagement.IsWindowObjectExist()) {
        width = this._renderingCanvas ? (this._renderingCanvas.clientWidth || this._renderingCanvas.width) : window.innerWidth;
        height = this._renderingCanvas ? (this._renderingCanvas.clientHeight || this._renderingCanvas.height) : window.innerHeight;
    } else {
        width = this._renderingCanvas ? this._renderingCanvas.width : 100;
        height = this._renderingCanvas ? this._renderingCanvas.height : 100;
    }

    this.setSize(width / this._hardwareScalingLevel, height / this._hardwareScalingLevel);
}

/**
  * Force a specific size of the canvas
  * @param width defines the new canvas' width
  * @param height defines the new canvas' height
  * @returns true if the size was changed
  */
public setSize(width: number, height: number): boolean {
    if (!this._renderingCanvas) {
        return false;
    }

    width = width | 0;
    height = height | 0;

    if (this._renderingCanvas.width === width && this._renderingCanvas.height === height) {
        return false;
    }

    this._renderingCanvas.width = width;
    this._renderingCanvas.height = height;

    return true;
}
```

It appears that PlayCanvas has three options for resizing the canvas:

- Fill Window - fills window but changes the aspect ratio to fit.
- Keep Aspect - keeps aspect ratio but attempts to fill window.
- None - the window will go to size given

* Threeify will only support FillWindow. IF you want to keep the aspect ratio fixed, do that in the CSS or React code.
* It appears that we should not resize when in XR mode -- both babylon and PlayCanvas avoid that.
