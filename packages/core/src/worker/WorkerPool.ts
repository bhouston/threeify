interface IPoolRequest {
  id: number;
  type: string;
  parameters: any;
  buffers?: ArrayBuffer[];
  resolve: (result: any) => void;
  reject: (error: Error) => void;
}

interface IPoolResponse {
  type: string;
  requestId: number;
  result?: any;
  message?: string;
}

export class WorkerPool {
  private nextRequestId = 0;
  private requestQueue: IPoolRequest[] = [];
  private processingRequests: IPoolRequest[] = [];
  private workerThreads: Worker[] = [];
  private idleWorkerThreads: Worker[] = [];

  public constructor(
    public workerSourceUrl: string,
    numWorkerThreads = navigator?.hardwareConcurrency || 4
  ) {
    for (let i = 0; i < numWorkerThreads; i++) {
      const worker = new Worker(workerSourceUrl, {
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

  private onWorkerMessage(worker: Worker, event: MessageEvent<IPoolResponse>) {
    const response = event.data;
    //console.log(
    //  `WorkerQueue: received message from worker #${this.workerThreads.indexOf(worker)}, re: request ${response?.requestId}`
    //);
    const request = this.processingRequests.find(
      (request) => request.id === response.requestId
    );
    if (request === undefined) throw new Error('request is undefined');

    switch (response.type) {
      case 'completed':
        request.resolve(response.result);
        break;
      case 'error':
        request.reject(new Error(response.message || 'no message'));
        break;
      default:
        throw new Error(`Unknown event type ${response.type}`);
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

      //console.log(
      //  `WorkerQueue: assigning request ${request.id} to worker #${this.workerThreads.indexOf(worker)}`
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
