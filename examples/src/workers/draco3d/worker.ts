import {
  BackgroundWorker,
  IBackgroundRequest,
  IBackgroundResponse,
  sleep
} from '@threeify/core';

//import { DracoDecoderModule } from './draco3dgltf/draco_decoder';

const backgroundWorker = new BackgroundWorker();

async function init() {
  /*const response = await fetch('/examples/dist/workers/draco3d/draco3dgltf/draco_decoder.wasm');
  const wasmBinary = await response.arrayBuffer();

  const decoderModule = await createDecoderModule({
    wasmBinary
  });*/
  // console.log('DracoDecoderModule', DracoDecoderModule);
  //const decoder = new DracoDecoderModule.Decoder();

  backgroundWorker.handlers.set(
    'decode',
    (request: IBackgroundRequest): Promise<IBackgroundResponse> => {
      return new Promise<IBackgroundResponse>((resolve, reject) => {
        const buffer = request.buffers[0];
        /*  const decodeBuffer = new DracoDecoderModule.DecoderBuffer();
        decodeBuffer.Init(new Int8Array(buffer), buffer.byteLength);
        const geometryType = decoder.GetEncodedGeometryType(decodeBuffer);
        const geometry: any = {};
        switch (geometryType) {
          case DracoDecoderModule.TRIANGULAR_MESH:
            geometry.type = 'mesh';
            geometry.data = new DracoDecoderModule.Mesh();
            const status = decoder.DecodeBufferToMesh(
              decodeBuffer,
              geometry.data
            );
            if (!status.ok() || geometry.data.ptr === 0) {
              return reject(
                new Error('Decoding failed: ' + status.error_msg())
              );
            }
            break;
          default:
            return reject(new Error('Unknown geometry type.' + geometryType));
        }
        DracoDecoderModule.destroy(decodeBuffer);*/
        return resolve({
          requestId: request.id,
          result: true
          //  result: geometry,
          // buffers: geometry.buffers
        });
      });
    }
  );

  self.onmessage = (event) => backgroundWorker.onMessage(event);
}

init();
