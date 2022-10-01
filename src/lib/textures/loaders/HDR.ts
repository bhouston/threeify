//
//
//
// adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html
//
//

import { floatsToNormalizedBytes, normalizedByteToFloats } from '../../math/arrays/Conversions';
import { linearToRgbdArray, rgbeToLinearArray } from '../../math/Vector4.Functions';
import { DataType } from '../../renderers/webgl/textures/DataType';
import { ArrayBufferImage } from '../ArrayBufferImage';
import { PixelEncoding } from '../PixelEncoding';

class Buffer {
  constructor(public data: Uint8Array, public position: number) {}
}

export async function fetchCubeHDRs(urlPattern: string): Promise<ArrayBufferImage[]> {
  const cubeMapFaces = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
  const fetchPromises: Promise<ArrayBufferImage>[] = [];
  cubeMapFaces.forEach((face) => {
    fetchPromises.push(fetchHDR(urlPattern.replace('*', face)));
  });
  return Promise.all(fetchPromises);
}

export async function fetchHDR(url: string): Promise<ArrayBufferImage> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`response error: ${response.status}:${response.statusText}`);
  }
  return parseHDR(await response.arrayBuffer());
}

export function parseHDR(arrayBuffer: ArrayBuffer): ArrayBufferImage {
  const buffer = new Buffer(new Uint8Array(arrayBuffer), 0);
  const header = readHeader(buffer);
  const pixelData = readRLEPixelData(buffer.data.subarray(buffer.position), header.width, header.height);
  return new ArrayBufferImage(
    floatsToNormalizedBytes(linearToRgbdArray(rgbeToLinearArray(normalizedByteToFloats(pixelData)), 16)),
    header.width,
    header.height,
    DataType.UnsignedByte,
    PixelEncoding.RGBE,
  );
}

function stringFromCharCodes(unicode: Uint16Array): string {
  let result = '';
  for (let i = 0; i < unicode.length; i++) {
    result += String.fromCharCode(unicode[i]);
  }
  return result;
}
function fgets(buffer: Buffer, lineLimit = 0, consume = true): string | undefined {
  lineLimit = lineLimit === 0 ? 1024 : lineLimit;
  const chunkSize = 128;
  let p = buffer.position;
  let i = -1;
  let len = 0;
  let s = '';
  let chunk = stringFromCharCodes(new Uint16Array(buffer.data.subarray(p, p + chunkSize)));
  while ((i = chunk.indexOf('\n')) < 0 && len < lineLimit && p < buffer.data.byteLength) {
    s += chunk;
    len += chunk.length;
    p += chunkSize;
    chunk += stringFromCharCodes(new Uint16Array(buffer.data.subarray(p, p + chunkSize)));
  }

  if (i > -1) {
    if (consume !== false) {
      buffer.position += len + i + 1;
    }
    return s + chunk.slice(0, i);
  }

  return undefined;
}

class Header {
  valid = 0; /* indicate which fields are valid */
  string = ''; /* the actual header string */
  comments = ''; /* comments found in header */
  programType = 'RGBE'; /* listed at beginning of file to identify it after "#?". defaults to "RGBE" */
  format = ''; /* RGBE format, default 32-bit_rle_rgbe */
  gamma = 1.0; /* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */
  exposure = 1.0; /* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */
  width = 0;
  height = 0; /* image dimensions, width/height */
}

/* minimal header reading.  modify if you want to parse more information */
function readHeader(buffer: Buffer): Header {
  const RGBE_VALID_PROGRAMTYPE = 1;
  const RGBE_VALID_FORMAT = 2;
  const RGBE_VALID_DIMENSIONS = 4;

  let line; let
    match;
  // regexes to parse header info fields
  const magicTokenRegex = /^#\?(\S+)$/;
  const gammaRegex = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/;
  const exposureRegex = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/;
  const formatRegex = /^\s*FORMAT=(\S+)\s*$/;
  const dimensionsRegex = /^\s*-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/;
  // RGBE format header struct
  const header = new Header();

  if (buffer.position >= buffer.data.byteLength || (line = fgets(buffer)) === undefined) {
    throw new Error('hrd: no header found');
  }

  /* if you want to require the magic token then uncomment the next line */
  if ((match = line.match(magicTokenRegex)) === null) {
    throw new Error('hrd: bad initial token');
  }

  header.valid |= RGBE_VALID_PROGRAMTYPE;
  header.programType = match[1];
  header.string += `${line}\n`;

  while ( (line = fgets(buffer) ) !== undefined) {

    header.string += `${line}\n`;

    if (line.charAt(0) === '#') {
      header.comments += `${line}\n`;
      continue; // comment line
    }

    if ((match = line.match(gammaRegex)) !== null) {
      header.gamma = parseFloat(match[1]);
    }

    if ((match = line.match(exposureRegex)) !== null) {
      header.exposure = parseFloat(match[1]);
    }

    if ((match = line.match(formatRegex)) !== null) {
      header.valid |= RGBE_VALID_FORMAT;
      header.format = match[1]; // '32-bit_rle_rgbe';
    }

    if ((match = line.match(dimensionsRegex)) !== null) {
      header.valid |= RGBE_VALID_DIMENSIONS;
      header.height = parseInt(match[1], 10);
      header.width = parseInt(match[2], 10);
    }

    if ((header.valid & RGBE_VALID_FORMAT) !== 0 && (header.valid & RGBE_VALID_DIMENSIONS) !== 0) {
      break;
    }
  }

  if ((header.valid & RGBE_VALID_FORMAT) === 0) {
    throw new Error('hrd: missing format specifier');
  }

  if ((header.valid & RGBE_VALID_DIMENSIONS) === 0) {
    throw new Error('hdr: missing image size specifier');
  }

  return header;
}
function readRLEPixelData(byteArray: Uint8Array, width: number, height: number): Uint8Array {
  if (
    // run length encoding is not allowed so read flat
    width < 8
    || width > 0x7fff
    // this file is not run length encoded
    || byteArray[0] !== 2
    || byteArray[1] !== 2
    || (byteArray[2] & 0x80) !== 0
  ) {
    // return the flat buffer
    return byteArray;
  }

  if (width !== ((byteArray[2] << 8) | byteArray[3])) {
    throw new Error('hdr: wrong scanline width');
  }

  const dataRgba = new Uint8Array(4 * width * height);

  let offset = 0;
  let pos = 0;
  const ptrEnd = 4 * width;
  const rgbeStart = new Uint8Array(4);
  const scanlineBuffer = new Uint8Array(ptrEnd);

  // read in each successive scanline
  while (height > 0 && pos < byteArray.byteLength) {
    if (pos + 4 > byteArray.byteLength) {
      throw new Error('hdr: read error');
    }

    rgbeStart[0] = byteArray[pos++];
    rgbeStart[1] = byteArray[pos++];
    rgbeStart[2] = byteArray[pos++];
    rgbeStart[3] = byteArray[pos++];

    if (rgbeStart[0] !== 2 || rgbeStart[1] !== 2 || ((rgbeStart[2] << 8) | rgbeStart[3]) !== width) {
      throw new Error('hdr: bad rgbe scanline format');
    }

    // read each of the four channels for the scanline into the buffer
    // first red, then green, then blue, then exponent
    let ptr = 0;
    while (ptr < ptrEnd && pos < byteArray.byteLength) {
      let count = byteArray[pos++];
      const isEncodedRun = count > 128;
      if (isEncodedRun) {
        count -= 128;
      }

      if (count === 0 || ptr + count > ptrEnd) {
        throw new Error('hdr: bad scanline data');
      }

      if (isEncodedRun) {
        // a (encoded) run of the same value
        const byteValue = byteArray[pos++];
        for (let i = 0; i < count; i++) {
          scanlineBuffer[ptr++] = byteValue;
        }
        // ptr += count;
      } else {
        // a literal-run
        scanlineBuffer.set(byteArray.subarray(pos, pos + count), ptr);
        ptr += count;
        pos += count;
      }
    }

    // now convert data from buffer into rgba
    // first red, then green, then blue, then exponent (alpha)
    for (let i = 0; i < width; i++) {
      let off = 0;
      dataRgba[offset] = scanlineBuffer[i + off];
      off += width; // 1;
      dataRgba[offset + 1] = scanlineBuffer[i + off];
      off += width; // 1;
      dataRgba[offset + 2] = scanlineBuffer[i + off];
      off += width; // 1;
      dataRgba[offset + 3] = scanlineBuffer[i + off];
      offset += 4;
    }

    height--;
  }

  return dataRgba;
}
