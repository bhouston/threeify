const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4e4f534a, BIN: 0x004e4942 };

export function getGLBJsonAndBody(data: ArrayBufferLike): {
  content: any;
  body: ArrayBufferLike;
} {
  const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
  const textDecoder = new TextDecoder();

  const header = {
    magic: textDecoder.decode(new Uint8Array(data.slice(0, 4))),
    version: headerView.getUint32(4, true),
    length: headerView.getUint32(8, true)
  };

  if (header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
    throw new Error('GLB: Unsupported glTF-Binary header.');
  } else if (header.version < 2) {
    throw new Error('GLB: Legacy binary file detected.');
  }

  const chunkContentsLength = header.length - BINARY_EXTENSION_HEADER_LENGTH;
  const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
  let chunkIndex = 0;

  let content: any = {};
  let body: ArrayBufferLike = new ArrayBuffer(0);

  while (chunkIndex < chunkContentsLength) {
    const chunkLength = chunkView.getUint32(chunkIndex, true);
    chunkIndex += 4;

    const chunkType = chunkView.getUint32(chunkIndex, true);
    chunkIndex += 4;

    switch (chunkType) {
      case BINARY_EXTENSION_CHUNK_TYPES.JSON:
        {
          const contentArray = new Uint8Array(
            data,
            BINARY_EXTENSION_HEADER_LENGTH + chunkIndex,
            chunkLength
          );
          content = JSON.parse(textDecoder.decode(contentArray));
        }
        break;
      case BINARY_EXTENSION_CHUNK_TYPES.BIN:
        {
          const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
          body = data.slice(byteOffset, byteOffset + chunkLength);
        }
        break;
    }
    chunkIndex += chunkLength;
  }

  return { content, body };
}
