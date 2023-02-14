import { WorkerQueue } from '@threeify/core';

async function init(): Promise<void> {
  const workerQueue = new WorkerQueue();
  console.log('background delay');

  const results: Promise<any>[] = [];
  for (let i = 0; i < 100; i++) {
    const promise = workerQueue.enqueueRequest(
      'delay',
      { delay: 1000 + i },
      undefined
    );
    results[i] = promise;
    // eslint-disable-next-line promise/catch-or-return
    promise.then(() => {
      console.log(`delay ${i} completed`);
      return undefined;
    });
  }
  console.log('finished queuing all requests');
  await Promise.all(results);
}

init();
