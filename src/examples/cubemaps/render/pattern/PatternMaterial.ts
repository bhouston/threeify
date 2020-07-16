import { ShaderMaterial } from "../../../../lib/materials/ShaderMaterial";
import fragmentSourceCode from "./fragment.glsl";
import vertexSourceCode from "./vertex.glsl";

export const patternMaterial = new ShaderMaterial(vertexSourceCode, fragmentSourceCode);
