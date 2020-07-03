import { makeFloat32Attribute, makeUint32Attribute } from "../Attribute";
import { Geometry } from "../Geometry";

export async function fetchOBJ(url: string): Promise<Geometry[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("response error: " + response.status + ":" + response.statusText);
  }
  return parseOBJ(await response.text());
}

const commentRegexp = /^#.*$/;
const objectRegexp = /^o +(.+)?/;
const groupRegexp = /^g +(.+)?/;
const vertexRegexp = /^v +(.+)?/;
const normalRegexp = /^vn +(.+)?/;
const uvRegexp = /^vt +(.+)?/;
const faceRegexp = /^f +(.+)?/;
const sRegexp = /^s +(.+)?/;
const matLibRegexp = /^mtllib +.*$/;
const useMtlRegexp = /^usemtl +.*$/;
const useMapRegexp = /^usemap +.*$/;

export function parseOBJ(text: string): Geometry[] {
  const geometries: Geometry[] = [];
  let workingPositions: number[] = [];
  let workingNormals: number[] = [];
  let workingUvs: number[] = [];

  let positions: number[] = [];
  let normals: number[] = [];
  let uvs: number[] = [];
  let indices: number[] = [];

  function commitGroup(): void {
    if (indices.length === 0) {
      return;
    }
    const geometry = new Geometry();
    geometry.indices = makeUint32Attribute(indices);
    geometry.attributes["position"] = makeFloat32Attribute(positions, 3);
    geometry.attributes["normal"] = makeFloat32Attribute(normals, 3);
    geometry.attributes["uv"] = makeFloat32Attribute(uvs, 2);

    indices = [];
    positions = [];
    normals = [];
    uvs = [];

    geometries.push(geometry);
  }

  function commitObject(): void {
    commitGroup();
    workingPositions = [];
    workingNormals = [];
    workingUvs = [];
  }

  text.split("\n").forEach((line: string) => {
    const tokens = line.split(" ");
    if (vertexRegexp.test(line)) {
      workingPositions.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
    } else if (normalRegexp.test(line)) {
      workingNormals.push(parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]));
    } else if (uvRegexp.test(line)) {
      workingUvs.push(parseFloat(tokens[1]), parseFloat(tokens[2]));
    } else if (faceRegexp.test(line)) {
      const startVertex = positions.length / 3;
      tokens.slice(1).forEach((token) => {
        const vertexTokens = token.split("/");
        let positionsIndex = (parseInt(vertexTokens[0]) - 1) * 3;
        if (positionsIndex < 0) {
          positionsIndex += workingPositions.length / 3;
        }
        positions.push(
          workingPositions[positionsIndex],
          workingPositions[positionsIndex + 1],
          workingPositions[positionsIndex + 2],
        );
        if (vertexTokens[1].length > 0) {
          let normalIndex = (parseInt(vertexTokens[1]) - 1) * 3;
          if (normalIndex < 0) {
            normalIndex += workingNormals.length / 3;
          }
          normals.push(workingNormals[normalIndex], workingNormals[normalIndex + 1], workingNormals[normalIndex + 2]);
        }
        if (vertexTokens[2].length > 0) {
          let uvIndex = (parseInt(vertexTokens[2]) - 1) * 2;
          if (uvIndex < 0) {
            uvIndex += workingUvs.length / 2;
          }
          uvs.push(workingNormals[uvIndex], workingNormals[uvIndex + 1]);
        }
      });
      const endVertex = positions.length / 3;
      const numVertices = endVertex - startVertex;
      for (let i = 0; i < numVertices - 2; i++) {
        indices.push(startVertex);
        indices.push(startVertex + i + 2);
        indices.push(startVertex + i + 1);
      }
    } else if (commentRegexp.test(line)) {
      // ignore comments
    } else if (objectRegexp.test(line)) {
      commitObject();
    } else if (groupRegexp.test(line)) {
      commitGroup();
    } else if (sRegexp.test(line)) {
      // not supported
    } else if (matLibRegexp.test(line)) {
      // not supported
    } else if (useMtlRegexp.test(line)) {
      // not supported
    } else if (useMapRegexp.test(line)) {
      // not supported
    }
  });

  commitObject();

  return geometries;
}
