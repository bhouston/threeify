import { passGeometry } from "../../../lib/geometry/primitives/passGeometry";
import { icosahedronGeometry } from "../../../lib/geometry/primitives/polyhedronGeometry";
import { ShaderMaterial } from "../../../lib/materials/ShaderMaterial";
import { Euler } from "../../../lib/math/Euler";
import { Matrix4 } from "../../../lib/math/Matrix4";
import {
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
} from "../../../lib/math/Matrix4.Functions";
import { Vector2 } from "../../../lib/math/Vector2";
import { Vector3 } from "../../../lib/math/Vector3";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { Attachment } from "../../../lib/renderers/webgl/framebuffers/Attachment";
import { Framebuffer } from "../../../lib/renderers/webgl/framebuffers/Framebuffer";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import {
  makeTexImage2DFromTexture,
  makeTexImage2DFromCubeTexture,
} from "../../../lib/renderers/webgl/textures/TexImage2D";
import { TextureFilter } from "../../../lib/renderers/webgl/textures/TextureFilter";
import { cubeMapFaces, CubeMapTexture } from "../../../lib/textures/CubeTexture";
import { fetchImage } from "../../../lib/textures/loaders/Image";
import { Texture } from "../../../lib/textures/Texture";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";
import { TextureWrap } from "../../../lib/renderers/webgl/textures/TextureWrap";
import { cubeFaceMaterial } from "./cubeFaces/CubeFaceMaterial";

async function init(): Promise<null> {
  /* const garageTexture = new Texture(await fetchImage("/assets/textures/cube/garage/equirectangular.jpg"));
  garageTexture.wrapS = TextureWrap.Repeat;
  garageTexture.wrapT = TextureWrap.ClampToEdge;
  garageTexture.minFilter = TextureFilter.Linear;*/

  const debugTexture = new Texture(await fetchImage("/assets/textures/cube/debug/equirectangular.png"));
  debugTexture.wrapS = TextureWrap.Repeat;
  debugTexture.wrapT = TextureWrap.ClampToEdge;
  debugTexture.minFilter = TextureFilter.Linear;

  const geometry = icosahedronGeometry(0.75, 4);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const imageSize = new Vector2(1024, 1024);
  const cubeTexture = new CubeMapTexture([imageSize, imageSize, imageSize, imageSize, imageSize, imageSize]);
  cubeTexture.generateMipmaps = true;

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const cubeFaceGeometry = passGeometry();
  const cubeFaceProgram = makeProgramFromShaderMaterial(context, cubeFaceMaterial);
  const cubeFaceUniforms = {
    map: makeTexImage2DFromTexture(context, debugTexture),
    faceIndex: 0,
  };

  const cubeFaceBufferGeometry = makeBufferGeometryFromGeometry(context, cubeFaceGeometry);
  const cubeMap = makeTexImage2DFromCubeTexture(context, cubeTexture);

  const framebuffer = new Framebuffer(context);
  cubeMapFaces.forEach((cubeMapFace) => {
    framebuffer.attach(Attachment.Color0, cubeMap, cubeMapFace.target, 0);
    cubeFaceUniforms.faceIndex = cubeMapFace.index;

    framebuffer.renderBufferGeometry(cubeFaceProgram, cubeFaceUniforms, cubeFaceBufferGeometry);
  });
  cubeMap.generateMipmaps();

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3.0)),
    viewToScreen: makeMatrix4PerspectiveFov(25, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),
    cubeMap: cubeMap,
    mipCount: cubeTexture.mipCount,
    perceptualRoughness: 0,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);
    const now = Date.now();

    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld,
    );
    uniforms.perceptualRoughness = Math.sin(now * 0.001) * 0.5 + 0.5;

    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
