Understanding how SAO Works

1. SAO Material
2. Guassian Blur Material

Steps:

1. Render Depth to Depth Texture
2. Render Normal to Normal Texture
3. Render SAO Material to create SAO Texture
4. Blur SAO Texture
5. Render SAO on top of beauty pass (wrong!)

Do 1 & 2 as part of Depth Prepass.

Normal Texture should be RGBA8, MSAA.
SAO Texture should be RGBA8, MSAA.


New formulation:
1. Depth Prepass that creates depth + normal texture.  Use "mode" flag?
2. Render SAO. (Full Screen Pass)
3. Blue SAO. (Full SCreen Pass)
4. Render Opaque using SAO in screen space, access via gl_FragCoord.xy and also use Depth Test of Equal or Less.
