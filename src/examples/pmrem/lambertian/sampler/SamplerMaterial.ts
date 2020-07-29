import { ShaderMaterial } from "../../../../lib/materials/ShaderMaterial";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

export const samplerMaterial = new ShaderMaterial(vertexSource, fragmentSource);
