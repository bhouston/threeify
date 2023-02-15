import { WorkerQueue } from '@threeify/core';

async function init(): Promise<void> {
  const workerQueue = new WorkerQueue();
  const numOfRequests = 50;
  console.log(`submitting ${numOfRequests} requests to ${workerQueue.numWorkers} workers`);
  console.time('totalTime');
  console.time('submit');
  let totalDelay = 0;
  const results: Promise<any>[] = [];
  for (let i = 0; i < numOfRequests; i++) {
    const delay = 100 + i * 10;
    totalDelay += delay;
    const promise = workerQueue.enqueueRequest(
      'delay',
      { delay: delay },
      undefined
    );
    results[i] = promise;
    // eslint-disable-next-line promise/catch-or-return
    promise.then(() => {
      //console.log(`delay ${i} completed`);
      return undefined;
    });
    if (i < 10) {
      await sleep(0);
    }
  }
  console.timeEnd('submit');
  //console.log('finished queuing all requests');
  await Promise.all(results);
  console.timeEnd('totalTime');
  //console.log('completed all requests!');
  console.log( 'totalDelay', totalDelay, "perThreadDelay", totalDelay / workerQueue.numWorkers );
}

init();
