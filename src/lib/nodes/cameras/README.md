# Camera changes:

- Rename matrixWorldInverse -> matrixToWorld.  Per matrix naming conventions.
- Rename projectionMatrix -> worldToScreenProjection.  Per matrix naming conventions.
- Rename projectionMatrixInverse -> screenToWorldUnprojection.  Per matrix naming conventions.
- Added pixelAspectRatio.  This is a more natural aspect ratio specification.
- Remove automatic updating of camera matrices upon changes.
- Removed caching of camera matrices, replaced with toProjectionMatrix() abstract function.
- Passing in viewAspectRatio when requesting camera projections, avoids the need for aspectRatio in all cameras.

# PerspectiveCamera changes:

- fov -> verticalFov so no one needs to every ask which dimension it is.
- aspectRatio -> removed.  Replaced with Camera.pixelAspectRatio.

# Orthographic camera:

- top, bottom, left, right -> replaced with center (Vector2 = (0,0)) and height;  everything can be derived.


