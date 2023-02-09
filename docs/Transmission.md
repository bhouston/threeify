
Should transmission be rendered with transparent or as a separate pass?

I think that generally there is 3 render lists:

- opaque
- transparent
- transmissive

Each of these should be sorted:

- opaque, painters sort.
- transparent, reverse painters sort.
- transmissive, reverse painters sort.

The sort is done on the render items, they have:

- group order
- render order
- z

When rendering transmissive materials, Threej's uses a transmissionRenderTarget.

- It is a EXT_color_buffer_half_float.
- LinearMipmapLinearFilter.
- samples: 4, MSAA buffer.
- It is sized exactly to the back buffer size as this is allowed in WebGL2.  Done!
- When rendering to it, no tone mapping is used.  But then is also sRGB transform skipped?  So it is in linear space?
- Only opaque objects are rendered to it.

Is the transmission material render a separate render from the main opaque render?
Like, if we are rendering it into a MSAA buffer with half float precision, we could use that as the final
opaque pass by just combining it with the transparent and transmissive results?

So in this scenario:

- Render to opaque MSAA float buffer with no tone mapping, no sRGB conversion.
- Bilt results to a non-MSAA float buffer texImage2D and use it as a backgroundTexture.

- Clear MSAA float buffer.
- Render to transmissive MSAA float buffer with no tone mapping and no sRGB conversion.
- Bilt results to a non-MSAA float buffer texImage2D.

- Read from the two float buffers, overlay then, do tone mapping and sRGB conversion and write to the canvasFramebuffer.

