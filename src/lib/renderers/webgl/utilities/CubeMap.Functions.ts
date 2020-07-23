import { passGeometry } from "../../../geometry/primitives/passGeometry";
import { ShaderMaterial } from "../../../materials/ShaderMaterial";
import { Vector2 } from "../../../math/Vector2";
import { cubeMapFaces, CubeMapTexture } from "../../../textures/CubeTexture";
import { Texture } from "../../../textures/Texture";
import { makeBufferGeometryFromGeometry } from "../buffers/BufferGeometry";
import { Attachment } from "../framebuffers/Attachment";
import { Framebuffer } from "../framebuffers/Framebuffer";
import { makeProgramFromShaderMaterial } from "../programs/Program";
import { RenderingContext } from "../RenderingContext";
import { makeTexImage2DFromCubeTexture, makeTexImage2DFromTexture, TexImage2D } from "../textures/TexImage2D";
import { TextureFilter } from "../textures/TextureFilter";
import { TextureWrap } from "../textures/TextureWrap";
import cubeFaceFragmentSource from "./cubeFaces/fragment.glsl";
import cubeFaceVertexSource from "./cubeFaces/vertex.glsl";

export function makeCubeMapFromEquirectangularTexture(
  context: RenderingContext,
  equirectangularTexture: Texture,
  faceSize: Vector2,
): TexImage2D {
  // required for proper reading.
  equirectangularTexture.wrapS = TextureWrap.Repeat;
  equirectangularTexture.wrapT = TextureWrap.ClampToEdge;
  equirectangularTexture.minFilter = TextureFilter.Linear;

  const cubeTexture = new CubeMapTexture([faceSize, faceSize, faceSize, faceSize, faceSize, faceSize]);
  cubeTexture.generateMipmaps = true;

  const equirectangularMap = makeTexImage2DFromTexture(context, equirectangularTexture);
  const cubeFaceGeometry = passGeometry();
  const cubeFaceMaterial = new ShaderMaterial(cubeFaceVertexSource, cubeFaceFragmentSource);
  const cubeFaceProgram = makeProgramFromShaderMaterial(context, cubeFaceMaterial);
  const cubeFaceBufferGeometry = makeBufferGeometryFromGeometry(context, cubeFaceGeometry);
  const cubeMap = makeTexImage2DFromCubeTexture(context, cubeTexture);

  const cubeFaceFramebuffer = new Framebuffer(context);

  const cubeFaceUniforms = {
    map: equirectangularMap,
    faceIndex: 0,
  };

  cubeMapFaces.forEach((cubeMapFace) => {
    cubeFaceFramebuffer.attach(Attachment.Color0, cubeMap, cubeMapFace.target, 0);
    cubeFaceUniforms.faceIndex = cubeMapFace.index;
    cubeFaceFramebuffer.renderBufferGeometry(cubeFaceProgram, cubeFaceUniforms, cubeFaceBufferGeometry);
  });

  cubeMap.generateMipmaps();

  cubeFaceFramebuffer.dispose();
  cubeFaceBufferGeometry.dispose();
  cubeFaceProgram.dispose();
  cubeFaceGeometry.dispose();
  equirectangularMap.dispose();

  return cubeMap;
}
