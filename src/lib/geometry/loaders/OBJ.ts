import { makeFloat32Attribute, makeUint32Attribute } from "../Attribute";
import { Geometry } from "../Geometry";

export async function fetchOBJ(url: string): Promise<Geometry[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`response error: ${response.status}:${response.statusText}`);
  }
  return parseOBJ(await response.text());
}

const oRegexp = /^o +(.+)/;
const gRegexp = /^g +(.+)/;
const vRegexp = /^v +([\d.+-]+) +([\d.+-]+) +([\d.+-]+)/;
const vnRegexp = /^vn +([\d.+-]+) +([\d.+-]+) +([\d.+-]+)/;
const vtRegexp = /^vt +([\d.+-]+) +([\d.+-]+)/;
const fRegexp = /^f( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))?/;

// not yet supported
// const commentRegexp = /^#(.*)$/;
// const sRegexp = /^s +(\d+)/;
// const matLibRegexp = /^mtllib +(.*)$/;
// const useMtlRegexp = /^usemtl +(.*)$/;
// const useMapRegexp = /^usemap +(.*)$/;

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
    geometry.attributes.position = makeFloat32Attribute(positions, 3);
    geometry.attributes.normal = makeFloat32Attribute(normals, 3);
    geometry.attributes.uv = makeFloat32Attribute(uvs, 2);

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
    const vMatch = line.match(vRegexp);
    if (vMatch !== null) {
      workingPositions.push(parseFloat(vMatch[1]), parseFloat(vMatch[2]), parseFloat(vMatch[3]));
      return;
    }
    const vnMatch = line.match(vnRegexp);
    if (vnMatch !== null) {
      workingNormals.push(parseFloat(vnMatch[1]), parseFloat(vnMatch[2]), parseFloat(vnMatch[3]));
      return;
    }
    const vtMatch = line.match(vtRegexp);
    if (vtMatch !== null) {
      workingUvs.push(parseFloat(vtMatch[1]), parseFloat(vtMatch[2]));
      return;
    }
    const fMatch = line.match(fRegexp);
    if (fMatch !== null) {
      const startVertex = positions.length / 3;
      let numVertices = 3;
      if (fMatch[13] !== undefined) {
        numVertices++;
      }
      let baseOffset = 2;
      for (let v = 0; v < numVertices; v++) {
        let pi = (parseInt(fMatch[baseOffset + 0]) - 1) * 3;
        if (pi < 0) {
          pi += workingPositions.length / 3;
        }
        positions.push(workingPositions[pi], workingPositions[pi + 1], workingPositions[pi + 2]);
        const uvIndexToken = fMatch[baseOffset + 1];
        if (uvIndexToken.length > 0) {
          let uvi = (parseInt(uvIndexToken) - 1) * 2;
          if (uvi < 0) {
            uvi += workingUvs.length / 2;
          }
          uvs.push(workingUvs[uvi], workingUvs[uvi + 1]);
        }
        const normalIndexToken = fMatch[baseOffset + 2];
        if (normalIndexToken.length > 0) {
          let ni = (parseInt(normalIndexToken) - 1) * 3;
          if (ni < 0) {
            ni += workingNormals.length / 3;
          }
          normals.push(workingNormals[ni], workingNormals[ni + 1], workingNormals[ni + 2]);
        }
        baseOffset += 4;
      }
      for (let i = 0; i < numVertices - 2; i++) {
        indices.push(startVertex);
        indices.push(startVertex + i + 1);
        indices.push(startVertex + i + 2);
      }
    } else if (oRegexp.test(line)) {
      commitObject();
    } else if (gRegexp.test(line)) {
      commitGroup();
    } /* else if (commentRegexp.test(line)) {
      // ignore comments
    } else if (sRegexp.test(line)) {
      // not supported
    } else if (matLibRegexp.test(line)) {
      // not supported
    } else if (useMtlRegexp.test(line)) {
      // not supported
    } else if (useMapRegexp.test(line)) {
      // not supported
    } */
  });

  commitObject();

  return geometries;
}
