import { Orbit } from "../../../lib/controllers/Orbit";
import {
  DepthTestFunc,
  DepthTestState,
  Euler,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeMatrix4Inverse,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4RotationFromQuaternion,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Matrix4,
  passGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  TexImage2D,
  Texture,
  TextureFilter,
  TextureWrap,
} from "../../../lib/index";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = passGeometry();
  const passMaterial = new ShaderMaterial(vertexSource, fragmentSource);

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);

  const images = [];
  const textures: Texture[] = [];
  const texImage2Ds: TexImage2D[] = [];
  for (let i = 0; i < 5; i++) {
    images.push( fetchImage(`/assets/textures/cube/kitchen/kitchenb_${i+1}.jpg`).then( (image)=> {
         const texture = new Texture( image );
         texture.wrapS = TextureWrap.ClampToEdge;
         texture.wrapT = TextureWrap.ClampToEdge;
         texture.minFilter = TextureFilter.Linear;
        textures[i] = texture;

        texImage2Ds[i] = makeTexImage2DFromTexture(context, texture);
      }) );
  }

  await Promise.all( images );

  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const orbit = new Orbit( context.canvas );


  const passProgram = makeProgramFromShaderMaterial(context, passMaterial);
  const passUniforms = {
    viewToWorld: new Matrix4(),
    screenToView: makeMatrix4Inverse(makeMatrix4PerspectiveFov(30, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio)),
    equirectangularMap: texImage2Ds[0],
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();

    passUniforms.viewToWorld = makeMatrix4Inverse( makeMatrix4RotationFromQuaternion( orbit.orientation ) );
    passUniforms.equirectangularMap = texImage2Ds[ Math.floor(now / 1000) % images.length ];

    renderBufferGeometry(canvasFramebuffer, passProgram, passUniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
