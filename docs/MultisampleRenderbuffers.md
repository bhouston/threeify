The way that multi sampling works in WebGL2 is as follows:

You need a frame buffer that you will be rendering to.

During its initialization, you need to create a render buffer with a sample number.
Then you attach this to the frame buffer to say Color0.

Then you render to this frame buffer.

You can not use this frame buffer as a texture, so you make use of its results, you
use the biltFramebuffer command to copy from the source frame buffer to another framebuffer,
one with an attached TexImage2D to the color0 point.

Then you can use this TexImage2D as a texture for other operations.

