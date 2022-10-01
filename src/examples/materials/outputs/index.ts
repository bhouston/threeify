import {
  BufferBit,
  ClearState,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Euler,
  EulerOrder,
  fetchImage,
  fetchOBJ,
  makeBufferGeometryFromGeometry,
  makeMatrix4Concatenation,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Scale,
  makeMatrix4Translation,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Matrix4,
  OutputChannels,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  transformGeometry,
  Vector2,
  Vector3,
} from "../../../lib/index";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = (await fetchOBJ("/assets/models/ninjaHead/ninjaHead.obj"))[0];
  transformGeometry(
    geometry,
    makeMatrix4Concatenation(
      makeMatrix4Scale(new Vector3(0.06, 0.06, 0.06)),
      makeMatrix4Translation(new Vector3(0, -172, -4)),
    ),
  );
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const displacementTexture = new Texture(await fetchImage("/assets/models/ninjaHead/displacement.jpg"));
  const normalTexture = new Texture(await fetchImage("/assets/models/ninjaHead/normal.png"));

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const { canvasFramebuffer } = context;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const displacementMap = makeTexImage2DFromTexture(context, displacementTexture);
  const normalMap = makeTexImage2DFromTexture(context, normalTexture);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3.0)),
    viewToScreen: makeMatrix4PerspectiveFov(25, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),

    // lights
    pointLightViewPosition: new Vector3(0.0, 0, 0.0),
    pointLightIntensity: new Vector3(1, 1, 1).multiplyByScalar(40.0),
    pointLightRange: 12.0,

    // materials
    normalMap,
    normalScale: new Vector2(1, 1),
    displacementMap,
    displacementScale: 1.0,

    // shader output
    time: 0,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 1.0);
  canvasFramebuffer.cullingState = new CullingState(true);

  const fragmentOutputs = [
    OutputChannels.Depth,
    OutputChannels.DepthPacked,
    OutputChannels.Beauty,
    OutputChannels.Normal,
    OutputChannels.Albedo,
    OutputChannels.Diffuse,
    OutputChannels.Specular,
  ];

  let lastNow = Date.now();
  let averageDelta = -1;

  function animate(): void {
    const now = Date.now();
    if (averageDelta < 0) {
      averageDelta = lastNow - now;
    } else {
      averageDelta = averageDelta * 0.9 + (lastNow - now) * 0.1;
    }
    lastNow = now;

    uniforms.time += averageDelta;
    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(0.15 * Math.PI, now * 0.0002, 0, EulerOrder.XZY),
      uniforms.localToWorld,
    );

    const effectScale = Math.cos(now * 0.0008) * 0.5 + 0.5;
    uniforms.normalScale = new Vector2(-1.0, 1.0).multiplyByScalar(effectScale);
    uniforms.displacementScale = effectScale * 0.1;
    uniforms.pointLightViewPosition = new Vector3(Math.cos(now * 0.001) * 3.0, 2.0, 0.5);

    canvasFramebuffer.clear(BufferBit.All);
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
