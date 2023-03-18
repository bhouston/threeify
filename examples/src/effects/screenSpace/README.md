The point of this example is to compare a 3D render with the reconstruction of the 3D
positions from just the depth buffer and the clipToView matrix.  The idea is that
they should be the same.

How can I achieve this?

1) Render to the depth buffer and save it.
2) Render a second time and get the position and compared to the reconstructed value
from the depth buffer.
3) Output a color based on the error value.  Use hsv/hsl toColor functions.

So two separate modes to the material.
