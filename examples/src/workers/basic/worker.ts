import { BackgroundWorker, IWorkerRequest } from '@threeify/core';

const backgroundWorker = new BackgroundWorker();

backgroundWorker.handlers.set('delay', (request: IWorkerRequest) => {
  const delay = request.parameters.delay;
  const start = Date.now();
  while (Date.now() - start < delay) {
    // do nothing
  }
  return { requestId: request.id, result: delay, buffers: undefined };
});
