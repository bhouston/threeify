# Camera

## Changes from Three.js

* Remove the local matrices variables from the Camera classes.  It is hard to cache these effectively.
 * This removes the need to automatically update the camera matrices upon changes.
* Added pixelAspectRatio to base Camera class.
* Passing in viewAspectRatio when requesting camera projections, avoids the need for aspectRatio in all cameras.

Q: Why split aspectRatio into pixelAspectRatio and viewAspectRatio?

A: PixelAspectRatio is almost always 1.0, thus leave it alone.  ViewAspectRatio comes from the render region, thus you can read it automatically.  The end result: No need to manually update aspectRatio any more.

# PerspectiveCamera

## Changes from Three.js

* fov -> verticalFov so no one needs to every ask which dimension it is.
* Removed aspectRatio per above, instead using Camera.pixelAspectRatio and viewAspectRatio from render view.

# Orthographic

## Changes from Three.js

* top, bottom, left, right -> height and center.  This is easier to use.  Everything else can be derived.