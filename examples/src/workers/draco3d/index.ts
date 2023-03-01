import { WorkerPool } from '@threeify/core';

async function init(): Promise<void> {
  const workerPool = new WorkerPool('./dist/workers/draco3d/worker.js');
  const numOfRequests = 50;
  console.log(
    `submitting ${numOfRequests} requests to ${workerPool.numWorkers} workers`
  );
  console.time('totalTime');
  console.time('submit');
  let totalDelay = 0;
  const results: Promise<any>[] = [];
  for (let i = 0; i < numOfRequests; i++) {
    const delay = 100 + i * 10;
    totalDelay += delay;
    const promise = workerPool.enqueueRequest(
      'delay-async',
      { delay: delay },
      undefined
    );
    results[i] = promise;
    // eslint-disable-next-line promise/catch-or-return
    promise.then(() => {
      //console.log(`delay ${i} completed`);
      return undefined;
    });
  }
  console.timeEnd('submit');
  //console.log('finished queuing all requests');
  await Promise.all(results);
  console.timeEnd('totalTime');
  //console.log('completed all requests!');
  console.log(
    'totalDelay',
    totalDelay,
    'perThreadDelay',
    totalDelay / workerPool.numWorkers
  );
}

init();
