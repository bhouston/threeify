import {
  BackgroundWorker,
  IBackgroundRequest,
  IBackgroundResponse,
  sleep
} from '@threeify/core';

const backgroundWorker = new BackgroundWorker();

backgroundWorker.handlers.set('delay', (request: IBackgroundRequest) => {
  const delay = request.parameters.delay;
  const start = Date.now();
  while (Date.now() - start < delay) {
    // do nothing
  }
  //console.log(`handling processing id ${request.id}`);
  return Promise.resolve({
    requestId: request.id,
    result: delay,
    buffers: undefined
  } as IBackgroundResponse);
});

backgroundWorker.handlers.set('delay-async', (request: IBackgroundRequest) => {
  const delay = request.parameters.delay;
  const promise = new Promise<IBackgroundResponse>((resolve, _reject) => {
    sleep(delay)
      .then(() => {
        //console.log(`handling processing id ${request.id}`);
        return resolve({
          requestId: request.id,
          result: delay,
          buffers: undefined
        } as IBackgroundResponse);
      })
      .catch((error: any) => {
        console.error(error);
      });
  });
  return promise;
});

self.onmessage = (event) => backgroundWorker.onMessage(event);
