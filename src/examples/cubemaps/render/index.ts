import { planeGeometry } from "../../../lib/geometry/primitives/planeGeometry";
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
import { makeColor3FromHSL } from "../../../lib/math/Vector3.Functions";
import { makeBufferGeometryFromGeometry } from "../../../lib/renderers/webgl/buffers/BufferGeometry";
import { DepthTestFunc, DepthTestState } from "../../../lib/renderers/webgl/DepthTestState";
import { Attachment } from "../../../lib/renderers/webgl/framebuffers/Attachment";
import { Framebuffer } from "../../../lib/renderers/webgl/framebuffers/Framebuffer";
import { makeProgramFromShaderMaterial } from "../../../lib/renderers/webgl/programs/Program";
import { RenderingContext } from "../../../lib/renderers/webgl/RenderingContext";
import { makeTexImage2DFromCubeTexture } from "../../../lib/renderers/webgl/textures/TexImage2D";
import { cubeMapFaces, CubeMapTexture } from "../../../lib/textures/CubeTexture";
import fragmentSourceCode from "./fragment.glsl";
import { patternMaterial } from "./pattern/PatternMaterial";
import vertexSourceCode from "./vertex.glsl";

async function init(): Promise<null> {
  const geometry = icosahedronGeometry(0.75, 4);
  const material = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
  const imageSize = new Vector2(1024, 1024);
  const cubeTexture = new CubeMapTexture([imageSize, imageSize, imageSize, imageSize, imageSize, imageSize]);

  const context = new RenderingContext(document.getElementById("framebuffer") as HTMLCanvasElement);
  const canvasFramebuffer = context.canvasFramebuffer;
  window.addEventListener("resize", () => canvasFramebuffer.resize());

  const patternGeometry = planeGeometry(2, 2, 1, 1);
  const patternProgram = makeProgramFromShaderMaterial(context, patternMaterial);
  const patternUniforms = {
    color: new Vector3(1, 0, 0),
  };

  const patternBufferGeometry = makeBufferGeometryFromGeometry(context, patternGeometry);
  const cubeMap = makeTexImage2DFromCubeTexture(context, cubeTexture);

  const framebuffer = new Framebuffer(context);

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3.0)),
    viewToScreen: makeMatrix4PerspectiveFov(25, 0.1, 4.0, 1.0, canvasFramebuffer.aspectRatio),
    cubeMap: cubeMap,
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);
    const now = Date.now();

    cubeMapFaces.forEach((cubeMapFace, index) => {
      framebuffer.attach(Attachment.Color0, cubeMap, cubeMapFace.target, 0);
      patternUniforms.color = makeColor3FromHSL(index / 6 + now * 0.0001, 0.5, 0.5);

      framebuffer.renderBufferGeometry(patternProgram, patternUniforms, patternBufferGeometry);
    });

    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld,
    );
    canvasFramebuffer.renderBufferGeometry(program, uniforms, bufferGeometry, depthTestState);
  }

  animate();

  return null;
}

init();
