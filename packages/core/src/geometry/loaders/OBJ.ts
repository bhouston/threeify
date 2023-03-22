import { warnOnce } from '../../warnOnce.js';
import { makeFloat32Attribute, makeUint32Attribute } from '../Attribute.js';
import { Geometry } from '../Geometry.js';

export async function fetchOBJ(url: string): Promise<Geometry[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `response error: ${response.status}:${response.statusText}`
    );
  }
  return parseOBJ(await response.text(), url);
}

// eslint-disable-next-line unicorn/no-unsafe-regex
const lineRegex = /^([a-z]+)(?:\s+([\S\s]*))?$/i;
const oRegexp = /^(.+)/;
const gRegexp = /^(.+)/;
const vRegexp = /^([\d+.-]+) +([\d+.-]+) +([\d+.-]+)/;
const vnRegexp = /^([\d+.-]+) +([\d+.-]+) +([\d+.-]+)/;
const vtRegexp = /^([\d+.-]+) +([\d+.-]+)/;
const faceRegexp =
  // eslint-disable-next-line unicorn/no-unsafe-regex
  /^((\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))( +(\d+)\/(\d*)\/(\d*))?/;

export function parseOBJ(text: string, source: string): Geometry[] {
  const geometries: Geometry[] = [];
  let workingPositions: number[] = [];
  let workingNormals: number[] = [];
  let workingUvs: number[] = [];

  let positions: number[] = [];
  let normals: number[] = [];
  let uvs: number[] = [];
  let indices: number[] = [];

  let groupName = '';
  let objectName = '';

  function commitGroup(): void {
    if (indices.length === 0) {
      return;
    }

    const geometry = new Geometry();
    let name = '';
    if (objectName.length > 0) {
      name = objectName;
    }
    if (groupName.length > 0) {
      name += '/' + groupName;
    }
    if (name === '') {
      name = source;
    }
    geometry.name = name;
    console.log('geometry.name', geometry.name);

    geometry.indices = makeUint32Attribute(indices);
    indices = [];

    geometry.attributes.position = makeFloat32Attribute(positions, 3);
    positions = [];

    if (normals.length > 0) {
      geometry.attributes.normal = makeFloat32Attribute(normals, 3);
      normals = [];
    }

    if (uvs.length > 0) {
      geometry.attributes.uv0 = makeFloat32Attribute(uvs, 2);
      uvs = [];
    }

    geometries.push(geometry);
  }

  function commitObject(): void {
    commitGroup();
    workingPositions = [];
    workingNormals = [];
    workingUvs = [];
  }

  text.split('\n').forEach((line: string) => {
    const matches = line.match(lineRegex);
    if (matches) {
      const prefix = matches[1];
      const content = matches[2];

      switch (prefix) {
        case 'v': {
          const vMatch = content.match(vRegexp);
          if (vMatch === null) throw new Error(`invalid v line: ${line}`);
          workingPositions.push(
            Number.parseFloat(vMatch[1]),
            Number.parseFloat(vMatch[2]),
            Number.parseFloat(vMatch[3])
          );
          return;
        }
        case 'vn': {
          const vnMatch = content.match(vnRegexp);
          if (vnMatch === null) throw new Error(`invalid vn line: ${line}`);
          workingNormals.push(
            Number.parseFloat(vnMatch[1]),
            Number.parseFloat(vnMatch[2]),
            Number.parseFloat(vnMatch[3])
          );
          return;
        }
        case 'vt': {
          const vtMatch = content.match(vtRegexp);
          if (vtMatch === null) throw new Error(`invalid vt line: ${line}`);
          workingUvs.push(
            Number.parseFloat(vtMatch[1]),
            Number.parseFloat(vtMatch[2])
          );
          return;
        }
        case 'f': {
          const fMatch = content.match(faceRegexp);
          if (fMatch === null) throw new Error(`invalid f line: ${line}`);
          const startVertex = positions.length / 3;
          let numVertices = 3;
          if (fMatch[13] !== undefined) {
            numVertices++;
          }
          let baseOffset = 2;
          for (let v = 0; v < numVertices; v++) {
            let pi = (Number.parseInt(fMatch[baseOffset + 0]) - 1) * 3;
            if (pi < 0) {
              pi += workingPositions.length / 3;
            }
            positions.push(
              workingPositions[pi],
              workingPositions[pi + 1],
              workingPositions[pi + 2]
            );
            const uvIndexToken = fMatch[baseOffset + 1];
            if (uvIndexToken.length > 0) {
              let uvi = (Number.parseInt(uvIndexToken) - 1) * 2;
              if (uvi < 0) {
                uvi += workingUvs.length / 2;
              }
              uvs.push(workingUvs[uvi], workingUvs[uvi + 1]);
            }
            const normalIndexToken = fMatch[baseOffset + 2];
            if (normalIndexToken.length > 0) {
              let ni = (Number.parseInt(normalIndexToken) - 1) * 3;
              if (ni < 0) {
                ni += workingNormals.length / 3;
              }
              normals.push(
                workingNormals[ni],
                workingNormals[ni + 1],
                workingNormals[ni + 2]
              );
            }
            baseOffset += 4;
          }
          for (let i = 0; i < numVertices - 2; i++) {
            indices.push(startVertex, startVertex + i + 1, startVertex + i + 2);
          }
          return;
        }
        case 'o': {
          const oMatch = content.match(oRegexp);
          if (oMatch === null) throw new Error(`invalid o line: ${line}`);
          commitObject();
          objectName = oMatch[1];
          return;
        }
        case 'g': {
          const gMatch = content.match(gRegexp);
          if (gMatch === null) throw new Error(`invalid g line: ${line}`);
          commitGroup();
          groupName = gMatch[1];
          return;
        }
        case 's': {
          warnOnce('OBJLoader: smoothing groups are not supported.');
          return;
        }
        case 'mtllib': {
          warnOnce('OBJLoader: mtllib are not supported.');
          return;
        }
        case 'usemtl': {
          warnOnce('OBJLoader: usemtl are not supported.');
          return;
        }
        case 'usemap': {
          warnOnce('OBJLoader: usemap are not supported.');
          return;
        }
        case 'l': {
          warnOnce('OBJLoader: lines are not supported.');
          return;
        }
        case '#': {
          return;
        }
      }
    }
  });

  commitObject();

  return geometries;
}
