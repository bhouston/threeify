export interface IWorkerPoolResponse {
  type: string;
  requestId: number;
  result?: any;
  message?: string;
}

export interface IWorkerPoolRequest {
  id: number;
  type: string;
  parameters: any;
  buffers?: ArrayBuffer[];
  resolve: (result: any) => void;
  reject: (error: Error) => void;
}

export class WorkerPool {
  private nextRequestId = 0;
  private requestQueue: IWorkerPoolRequest[] = [];
  private processingRequests: IWorkerPoolRequest[] = [];
  private workerThreads: Worker[] = [];
  private idleWorkerThreads: Worker[] = [];

  public constructor(numWorkerThreads = navigator?.hardwareConcurrency || 4) {
    for (let i = 0; i < numWorkerThreads; i++) {
      const worker = new Worker('/packages/core/dist/worker/Worker.js', {
        type: 'module'
      });
      worker.onmessage = (event) => {
        this.onWorkerMessage(worker, event);
      };
      this.workerThreads.push(worker);
      this.idleWorkerThreads.push(worker);
    }
  }

  public get queueLength() {
    return this.requestQueue.length;
  }

  public get numWorkers() {
    return this.workerThreads.length;
  }

  private onWorkerMessage(
    worker: Worker,
    event: MessageEvent<IWorkerResponse>
  ) {
    const workerIndex = this.workerThreads.indexOf(worker);
    //console.log(
    //  `WorkerQueue: received message from worker #${workerIndex}, re: request ${event.data?.requestId}`
    //);
    const request = this.processingRequests.find(
      (request) => request.id === event.data.requestId
    );
    if (request === undefined) throw new Error('request is undefined');

    switch (event.data.type) {
      case 'completed':
        request.resolve(event.data.result);
        break;
      case 'error':
        request.reject(new Error(event.data.message || 'no message'));
        break;
      default:
        throw new Error(`Unknown event type ${event.type}`);
    }

    this.idleWorkerThreads.push(worker);
    this.keepWorkersBusy();
  }

  // enqueue a task and return a promise that will be resolved when the task is completed
  public enqueueRequest<T>(
    type: string,
    parameters: any,
    buffers?: ArrayBuffer[]
  ): Promise<T> {
    const id = this.nextRequestId++;
    //console.log(
    //  `WorkerQueue: enqueueing request ${type}, ${parameters.delay}, ${id}`
    //);
    const promise = new Promise<T>((resolve, reject) => {
      this.requestQueue.push({
        id,
        type,
        parameters,
        buffers,
        resolve,
        reject
      });
    });

    this.keepWorkersBusy();

    return promise;
  }

  // check whether any of the worker threads is ready for a new task.
  // if so, assign the next task in the queue to the worker thread.
  private keepWorkersBusy() {
    while (this.requestQueue.length > 0 && this.idleWorkerThreads.length > 0) {
      const request = this.requestQueue.shift();
      if (request === undefined) throw new Error('request is undefined');
      const worker = this.idleWorkerThreads.shift();
      if (worker === undefined) throw new Error('worker is undefined');
      const workerIndex = this.workerThreads.indexOf(worker);
      //console.log(
      //  `WorkerQueue: assigning request ${request.id} to worker #${workerIndex}`
      //);
      worker.postMessage(
        { id: request.id, type: request.type, parameters: request.parameters },
        request.buffers
      );
      this.processingRequests.push(request);
    }
  }

  dispose() {
    if (this.processingRequests.length > 0) {
      throw new Error('Cannot dispose while processing requests');
    }
    this.workerThreads.forEach((worker) => worker.terminate());
  }
}
