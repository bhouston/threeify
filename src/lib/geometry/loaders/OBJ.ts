import { makeFloat32Attribute, makeUint32Attribute } from "../Attribute";
import { Geometry } from "../Geometry";

export async function fetchOBJ(url: string): Promise<Geometry[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("response error: " + response.status + ":" + response.statusText);
  }
  return parseOBJ(await response.text());
}

const commentRegexp = /^#(.*)$/;
const objectRegexp = /^o +(.+)/;
const groupRegexp = /^g +(.+)/;
const positionRegexp = /^v +([\d.+-]+) +([\d.+-]+) +([\d.+-]+)/;
const normalRegexp = /^vn +([\d.+-]+) +([\d.+-]+) +([\d.+-]+)/;
const uvRegexp = /^vt +([\d.+-]+) +([\d.+-]+)/;
const faceRegexp = /^f( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))?/;
const sRegexp = /^s +(\d+)/;
const matLibRegexp = /^mtllib +(.*)$/;
const useMtlRegexp = /^usemtl +(.*)$/;
const useMapRegexp = /^usemap +(.*)$/;

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

  text.split("\n").forEach(function parseLine(line: string) {
    const positionMatch = line.match(positionRegexp);
    if (positionMatch !== null) {
      workingPositions.push(parseFloat(positionMatch[1]), parseFloat(positionMatch[2]), parseFloat(positionMatch[3]));
      return;
    }
    const normalMatch = line.match(normalRegexp);
    if (normalMatch !== null) {
      console.log(line, normalMatch);
      workingNormals.push(parseFloat(normalMatch[1]), parseFloat(normalMatch[2]), parseFloat(normalMatch[3]));
      return;
    }
    const uvMatch = line.match(uvRegexp);
    if (uvMatch !== null) {
      workingUvs.push(parseFloat(uvMatch[1]), parseFloat(uvMatch[2]));
      return;
    }
    const faceMatch = line.match(faceRegexp);
    if (faceMatch !== null) {
      const startVertex = positions.length / 3;
      let numVertices = 3;
      if (faceMatch[13] !== undefined) {
        numVertices++;
      }
      let baseOffset = 2;
      for (let v = 0; v < numVertices; v++) {
        let positionsIndex = (parseInt(faceMatch[baseOffset + 0]) - 1) * 3;
        if (positionsIndex < 0) {
          positionsIndex += workingPositions.length / 3;
        }
        positions.push(
          workingPositions[positionsIndex],
          workingPositions[positionsIndex + 1],
          workingPositions[positionsIndex + 2],
        );
        const uvIndexToken = faceMatch[baseOffset + 1];
        if (uvIndexToken.length > 0) {
          let uvIndex = (parseInt(uvIndexToken) - 1) * 2;
          if (uvIndex < 0) {
            uvIndex += workingUvs.length / 2;
          }
          uvs.push(workingUvs[uvIndex], workingUvs[uvIndex + 1]);
        }
        const normalIndexToken = faceMatch[baseOffset + 2];
        if (normalIndexToken.length > 0) {
          let normalIndex = (parseInt(normalIndexToken) - 1) * 3;
          if (normalIndex < 0) {
            normalIndex += workingNormals.length / 3;
          }
          normals.push(workingNormals[normalIndex], workingNormals[normalIndex + 1], workingNormals[normalIndex + 2]);
        }
        baseOffset += 4;
      }
      for (let i = 0; i < numVertices - 2; i++) {
        indices.push(startVertex);
        indices.push(startVertex + i + 1);
        indices.push(startVertex + i + 2);
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
