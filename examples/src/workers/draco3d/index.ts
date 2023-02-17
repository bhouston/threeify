//import * as draco3d from 'draco3d';
//import { createDecoderModule, DecoderModule } from 'draco3dgltf';
import * as draco3d from 'draco3d/draco_decoder_nodejs';

async function init() {
  console.log('draco3d', draco3d);
  /*
  createDecoderModule()
    .then((draco: DecoderModule) => {
      // draco is now ready to use
      console.log('dracoModule', draco);
      return;
    })
    .catch((error: any) => {
      console.error(error);
    });*/
}

init();

console.log('draco3d', draco3d);

window['draco3d'] = draco3d;
